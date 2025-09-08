import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar active={''} />
      <div className="main-content">
        <Header title={''} />
        {children}
      </div>
    </div>
  );
}