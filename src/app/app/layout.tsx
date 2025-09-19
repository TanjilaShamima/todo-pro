import Topbar from "@/@components/common/Topbar";
import ProtectedRoute from "@/features/auth/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <section>
        <Topbar />
        {children}
      </section>
    </ProtectedRoute>
  );
}
