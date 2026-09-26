import { redirect } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/admin/signin')
    }

    return (
      <div className="admin-layout">
        <AdminSidebar userEmail={user?.email ?? 'admin@learnwithemrul.com'} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    )
  }

  // Demo / local mode without Supabase connection
  return (
    <div className="admin-layout">
      <AdminSidebar userEmail="admin@learnwithemrul.com" />
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
