import { TrendingUp, Briefcase, FileText, Bell } from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import questionnaireApi from "../../api/QuestionnaireApi";
import { callAPI } from "../../config/AxiosInstance";
import UserContext from "../../store/UserContext";

const statCardConfig = [
    {
        key: "Investor Applications",
        Icon: TrendingUp,
        gradient: "from-amber-500 to-orange-500",
        lightGlow: "rgba(245,158,11,0.12)",
        accentColor: "#f59e0b",
    },
    {
        key: "Research Investment Applications",
        Icon: Briefcase,
        gradient: "from-rose-500 to-pink-500",
        lightGlow: "rgba(244,63,94,0.12)",
        accentColor: "#f43f5e",
    },
    {
        key: "Research Proposal Applications",
        Icon: FileText,
        gradient: "from-emerald-500 to-teal-500",
        lightGlow: "rgba(16,185,129,0.12)",
        accentColor: "#10b981",
    },
];

// ─── SVG Donut Chart ───
const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    <text x="80" y="85" textAnchor="middle" className="text-2xl font-bold" fill="#9ca3af">0</text>
                </svg>
                <p className="text-sm text-gray-400 mt-2">No proposals yet</p>
            </div>
        );
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex flex-col items-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                {data.map((d, i) => {
                    const pct = d.value / total;
                    const dashLen = pct * circumference;
                    const gap = circumference - dashLen;
                    const el = (
                        <circle
                            key={i}
                            cx="80" cy="80" r={radius}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="20"
                            strokeDasharray={`${dashLen} ${gap}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    );
                    offset += dashLen;
                    return el;
                })}
                <text x="80" y="85" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937" transform="rotate(90,80,80)">{total}</text>
            </svg>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-600">{d.label} ({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewerDashboardScreen = () => {
    const { userInfo } = useContext(UserContext);
    const [newNotifications, setNewNotifications] = useState({
        investor: 0,
        researchInvestment: 0,
        researchProposal: 0
    });


    const handleNotificationClick = (notificationType: string) => {
        setNewNotifications(prev => ({
            ...prev,
            [notificationType]: 0
        }));
    };

    const [stats, setStats] = useState([
        { title: "Investor Applications", count: 0, showBell: true, notificationType: 'investor' },
        { title: "Research Investment Applications", count: 0, showBell: true, notificationType: 'researchInvestment' },
        { title: "Research Proposal Applications", count: 0, showBell: true, notificationType: 'researchProposal' },
    ]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const unopenedRes = await callAPI("GET", "/proposals/unopened-count");
                const unopened = (unopenedRes as any)?.data || {};

                const investorFallback = await questionnaireApi.InvestorApplicationCount();
                const researchInvestmentFallback = await questionnaireApi.ResearchInvestmentApplicationCount();
                const researchProposalFallback = await questionnaireApi.ResearchProposalApplicationCount();

                const getCount = (obj: any) => obj && typeof obj.count === 'number' ? obj.count : 0;
                const investorAppCount = typeof unopened.investor === 'number' ? unopened.investor : getCount(investorFallback);
                const researchInvestmentAppCount = typeof unopened.researchInvestment === 'number' ? unopened.researchInvestment : getCount(researchInvestmentFallback);
                const researchProposalAppCount = typeof unopened.research === 'number' ? unopened.research : getCount(researchProposalFallback);

                setStats(prevStats => prevStats.map(stat => {
                    let newCount = 0;
                    if (stat.title === "Investor Applications") {
                        newCount = investorAppCount;
                        if (newCount > stat.count) {
                            setNewNotifications(prev => ({ ...prev, investor: newCount - stat.count }));
                        }
                        return {...stat, count: newCount};
                    } else if (stat.title === "Research Investment Applications") {
                        newCount = researchInvestmentAppCount;
                        if (newCount > stat.count) {
                            setNewNotifications(prev => ({ ...prev, researchInvestment: newCount - stat.count }));
                        }
                        return {...stat, count: newCount};
                    } else if (stat.title === "Research Proposal Applications") {
                        newCount = researchProposalAppCount;
                        if (newCount > stat.count) {
                            setNewNotifications(prev => ({ ...prev, researchProposal: newCount - stat.count }));
                        }
                        return {...stat, count: newCount};
                    }
                    return stat;
                }));
            } catch (error) {
                // silently fail
            }
        };

        fetchCounts();
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    // ─── Chart Data ───
    const chartData = useMemo(() => {
        const investor = stats.find(s => s.title === "Investor Applications")?.count || 0;
        const resInvest = stats.find(s => s.title === "Research Investment Applications")?.count || 0;
        const resProp = stats.find(s => s.title === "Research Proposal Applications")?.count || 0;
        return [
            { label: "Investor", value: investor, color: "#f59e0b" },
            { label: "Research Invest.", value: resInvest, color: "#f43f5e" },
            { label: "Research Prop.", value: resProp, color: "#10b981" },
        ];
    }, [stats]);


    // ─── Greeting ───
    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    }, []);

    const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <>
            {/* ─── Welcome Header ─── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {greeting}, {userInfo?.userName || "Admin"} 👋
                </h1>
                <p className="text-sm text-gray-500 mt-1">{todayStr} — Here's your dashboard overview</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {stats.map((stat, index) => {
                    const config = statCardConfig[index];
                    const notifCount = stat.notificationType === 'investor'
                        ? newNotifications.investor
                        : stat.notificationType === 'researchInvestment'
                        ? newNotifications.researchInvestment
                        : stat.notificationType === 'researchProposal'
                        ? newNotifications.researchProposal
                        : 0;

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
                            style={{
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                        >
                            {/* Top accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />

                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                                </div>
                                <div className="relative">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
                                        style={{ boxShadow: `0 4px 12px ${config.lightGlow}` }}
                                    >
                                        <config.Icon size={22} className="text-white" />
                                    </div>
                                    {stat.showBell && notifCount > 0 && (
                                        <button
                                            onClick={() => handleNotificationClick(stat.notificationType || '')}
                                            className="absolute -top-2 -right-2 flex items-center justify-center"
                                        >
                                            <span className="relative flex items-center justify-center">
                                                <Bell size={18} className="text-gray-400" />
                                                <span
                                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                                >
                                                    {notifCount}
                                                </span>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ─── Charts Row ─── */}
            <div className="grid grid-cols-1 gap-5 mb-6">
                {/* Donut Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 bg-[#003893] rounded-full" />
                        Proposal Distribution
                    </h3>
                    <div className="flex justify-center py-2">
                        <DonutChart data={chartData} />
                    </div>
                </div>
            </div>


        </>
    );
};

export default ReviewerDashboardScreen;