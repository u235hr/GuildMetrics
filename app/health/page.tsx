import CodeHealthPanel from '@/components/CodeHealthPanel';

export default function HealthPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">代码健康检查</h1>
        <p className="text-slate-400">自动扫描性能反模式和潜在问题</p>
      </div>
      
      <CodeHealthPanel />
    </div>
  );
}