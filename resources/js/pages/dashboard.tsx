import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AdminDashboard from '@/pages/dashboard/admin';
import GuruDashboard from '@/pages/dashboard/guru';
import SiswaDashboard from '@/pages/dashboard/siswa';
import OrangTuaDashboard from '@/pages/dashboard/orangtua';

interface DashboardProps {
    role: 'admin' | 'guru' | 'siswa' | 'orangtua';
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any; // Allow other role-specific props to pass down
}

export default function Dashboard({ role, auth, ...props }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6 bg-neutral-50/30 dark:bg-neutral-900/10">
                {role === 'admin' && (
                    <AdminDashboard 
                        stats={props.stats} 
                        classes={props.classes} 
                        teachers={props.teachers} 
                        students={props.students} 
                        parents={props.parents} 
                        mapels={props.mapels || []}
                        jadwals={props.jadwals || []}
                    />
                )}
                {role === 'guru' && (
                    <GuruDashboard 
                        kelas_wali={props.kelas_wali} 
                        students={props.students} 
                        pending_izin={props.pending_izin} 
                        history={props.history} 
                        all_classes={props.all_classes} 
                        auth={auth} 
                        jadwals={props.jadwals || []}
                    />
                )}
                {role === 'siswa' && (
                    <SiswaDashboard 
                        kelas_name={props.kelas_name} 
                        stats={props.stats} 
                        leave_requests={props.leave_requests} 
                        history={props.history} 
                        auth={auth} 
                        jadwals={props.jadwals || []}
                    />
                )}
                {role === 'orangtua' && (
                    <OrangTuaDashboard 
                        children={props.children || []} 
                        auth={auth} 
                    />
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
