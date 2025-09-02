/**
 * 本地存储管理器 - 使用IndexedDB和localStorage存储数据
 * IndexedDB用于存储大量数据，localStorage用于存储用户设置
 */

import Dexie, { Table } from 'dexie';
import type { MonthlyData, UserSettings, UploadStatus } from '../types';

// IndexedDB 数据库结构定义
export interface StoredMonthlyData extends MonthlyData {
  id?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFile {
  id?: number;
  fileName: string;
  content: string;
  month: number;
  year: number;
  uploadTime: string;
  fileSize: number;
}

export interface AppData {
  id?: number;
  key: string;
  value: unknown;
  updatedAt: string;
}

// IndexedDB 数据库类
class StreamerDashboardDB extends Dexie {
  monthlyData!: Table<StoredMonthlyData>;
  uploadedFiles!: Table<StoredFile>;
  appData!: Table<AppData>;

  constructor() {
    super('StreamerDashboardDB');
    
    // 定义数据库架构
    this.version(1).stores({
      monthlyData: '++id, month, year, createdAt, updatedAt',
      uploadedFiles: '++id, fileName, month, year, uploadTime',
      appData: '++id, key, updatedAt'
    });
  }
}

// 创建数据库实例
const db = new StreamerDashboardDB();

// localStorage 键名常量
const STORAGE_KEYS = {
  USER_SETTINGS: 'streamer_dashboard_user_settings',
  UPLOAD_STATUS: 'streamer_dashboard_upload_status',
  LAST_SELECTED_MONTH: 'streamer_dashboard_last_selected_month',
  APP_PREFERENCES: 'streamer_dashboard_app_preferences'
} as const;

export class LocalStorageManager {
  // =================== IndexedDB 操作 ===================

  /**
   * 保存月度数据到IndexedDB
   */
  static async saveMonthlyData(data: MonthlyData): Promise<void> {
    try {
      const existingData = await db.monthlyData
        .where('month')
        .equals(data.month)
        .and(item => item.year === data.year)
        .first();

      const storedData: StoredMonthlyData = {
        ...data,
        createdAt: existingData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingData) {
        // 更新现有数据
        await db.monthlyData.update(existingData.id!, storedData);
        console.log(`已更新 ${data.year}年${data.month}月 数据`);
      } else {
        // 创建新数据
        await db.monthlyData.add(storedData);
        console.log(`已保存 ${data.year}年${data.month}月 数据`);
      }
    } catch (error) {
      console.error('保存月度数据失败:', error);
      throw error;
    }
  }

  /**
   * 从IndexedDB获取月度数据
   */
  static async getMonthlyData(month: number, year: number = new Date().getFullYear()): Promise<MonthlyData | null> {
    try {
      const data = await db.monthlyData
        .where('month')
        .equals(month)
        .and(item => item.year === year)
        .first();
      
      if (data) {
        const monthlyData = { ...data };
        delete monthlyData.id;
        delete monthlyData.createdAt;
        delete monthlyData.updatedAt;
        return monthlyData;
      }
      return null;
    } catch (error) {
      console.error('获取月度数据失败:', error);
      return null;
    }
  }

  /**
   * 获取所有月度数据
   */
  static async getAllMonthlyData(): Promise<MonthlyData[]> {
    try {
      const allData = await db.monthlyData.orderBy('year').reverse().then(
        items => items.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        })
      );
      
      return allData.map(data => {
        const monthlyData = { ...data };
        delete monthlyData.id;
        delete monthlyData.createdAt;
        delete monthlyData.updatedAt;
        return monthlyData;
      });
    } catch (error) {
      console.error('获取所有月度数据失败:', error);
      return [];
    }
  }

  /**
   * 删除月度数据
   */
  static async deleteMonthlyData(month: number, year: number = new Date().getFullYear()): Promise<boolean> {
    try {
      const count = await db.monthlyData
        .where('month')
        .equals(month)
        .and(item => item.year === year)
        .delete();
      
      console.log(`已删除 ${year}年${month}月 数据`);
      return count > 0;
    } catch (error) {
      console.error('删除月度数据失败:', error);
      return false;
    }
  }

  /**
   * 保存上传的文件信息
   */
  static async saveUploadedFile(fileName: string, content: string, month: number, year: number): Promise<void> {
    try {
      const fileInfo: StoredFile = {
        fileName,
        content,
        month,
        year,
        uploadTime: new Date().toISOString(),
        fileSize: content.length
      };

      await db.uploadedFiles.add(fileInfo);
      console.log(`已保存文件: ${fileName}`);
    } catch (error) {
      console.error('保存文件失败:', error);
      throw error;
    }
  }

  /**
   * 获取上传历史
   */
  static async getUploadHistory(limit: number = 20): Promise<StoredFile[]> {
    try {
      return await db.uploadedFiles
        .orderBy('uploadTime')
        .reverse()
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('获取上传历史失败:', error);
      return [];
    }
  }

  /**
   * 清理旧文件（保留最近N个）
   */
  static async cleanupOldFiles(keepCount: number = 50): Promise<void> {
    try {
      const allFiles = await db.uploadedFiles.orderBy('uploadTime').reverse().toArray();
      if (allFiles.length > keepCount) {
        const filesToDelete = allFiles.slice(keepCount);
        const idsToDelete = filesToDelete.map(f => f.id!);
        await db.uploadedFiles.bulkDelete(idsToDelete);
        console.log(`已清理 ${filesToDelete.length} 个旧文件`);
      }
    } catch (error) {
      console.error('清理旧文件失败:', error);
    }
  }

  // =================== localStorage 操作 ===================

  /**
   * 保存用户设置
   */
  static saveUserSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
      console.log('用户设置已保存');
    } catch (error) {
      console.error('保存用户设置失败:', error);
    }
  }

  /**
   * 获取用户设置
   */
  static getUserSettings(): UserSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('获取用户设置失败:', error);
      return null;
    }
  }

  /**
   * 保存上传状态
   */
  static saveUploadStatus(status: UploadStatus): void {
    try {
      localStorage.setItem(STORAGE_KEYS.UPLOAD_STATUS, JSON.stringify(status));
    } catch (error) {
      console.error('保存上传状态失败:', error);
    }
  }

  /**
   * 获取上传状态
   */
  static getUploadStatus(): UploadStatus | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.UPLOAD_STATUS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('获取上传状态失败:', error);
      return null;
    }
  }

  /**
   * 保存最后选择的月份
   */
  static saveLastSelectedMonth(month: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SELECTED_MONTH, month.toString());
    } catch (error) {
      console.error('保存最后选择月份失败:', error);
    }
  }

  /**
   * 获取最后选择的月份
   */
  static getLastSelectedMonth(): number | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SELECTED_MONTH);
      return stored ? parseInt(stored, 10) : null;
    } catch (error) {
      console.error('获取最后选择月份失败:', error);
      return null;
    }
  }

  /**
   * 保存应用偏好设置
   */
  static saveAppPreferences(preferences: Record<string, unknown>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('保存应用偏好失败:', error);
    }
  }

  /**
   * 获取应用偏好设置
   */
  static getAppPreferences(): Record<string, unknown> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APP_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('获取应用偏好失败:', error);
      return {};
    }
  }

  // =================== 数据管理 ===================

  /**
   * 获取存储统计信息
   */
  static async getStorageStats(): Promise<{
    monthlyDataCount: number;
    uploadedFilesCount: number;
    totalSize: number;
    lastUpdate: string | null;
  }> {
    try {
      const monthlyDataCount = await db.monthlyData.count();
      const uploadedFilesCount = await db.uploadedFiles.count();
      
      const allFiles = await db.uploadedFiles.toArray();
      const totalSize = allFiles.reduce((sum, file) => sum + file.fileSize, 0);
      
      const latestData = await db.monthlyData.orderBy('updatedAt').reverse().first();
      const lastUpdate = latestData?.updatedAt || null;

      return {
        monthlyDataCount,
        uploadedFilesCount,
        totalSize,
        lastUpdate
      };
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return {
        monthlyDataCount: 0,
        uploadedFilesCount: 0,
        totalSize: 0,
        lastUpdate: null
      };
    }
  }

  /**
   * 清空所有数据
   */
  static async clearAllData(): Promise<void> {
    try {
      await db.monthlyData.clear();
      await db.uploadedFiles.clear();
      await db.appData.clear();
      
      // 清除localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('所有数据已清空');
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }

  /**
   * 导出数据备份
   */
  static async exportBackup(): Promise<{
    monthlyData: MonthlyData[];
    userSettings: UserSettings | null;
    uploadHistory: StoredFile[];
    exportTime: string;
  }> {
    try {
      const monthlyData = await this.getAllMonthlyData();
      const userSettings = this.getUserSettings();
      const uploadHistory = await this.getUploadHistory(100);
      
      return {
        monthlyData,
        userSettings,
        uploadHistory,
        exportTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('导出备份失败:', error);
      throw error;
    }
  }

  /**
   * 导入数据备份
   */
  static async importBackup(backup: {
    monthlyData: MonthlyData[];
    userSettings?: UserSettings;
    uploadHistory?: StoredFile[];
  }): Promise<void> {
    try {
      // 导入月度数据
      for (const data of backup.monthlyData) {
        await this.saveMonthlyData(data);
      }
      
      // 导入用户设置
      if (backup.userSettings) {
        this.saveUserSettings(backup.userSettings);
      }
      
      // 导入上传历史
      if (backup.uploadHistory) {
        for (const file of backup.uploadHistory) {
          const fileData = { ...file };
          delete fileData.id;
          await db.uploadedFiles.add(fileData);
        }
      }
      
      console.log('备份导入完成');
    } catch (error) {
      console.error('导入备份失败:', error);
      throw error;
    }
  }
}

// 导出数据库实例供其他地方使用
export { db };