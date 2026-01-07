
import React from 'react';
import {
    Sun, Moon, Search, ArrowRight, LayoutGrid, Wallet, BarChart2, Zap, HelpCircle,
    LifeBuoy, Landmark, Hammer, FileText, ShieldCheck, Bug, Plus, Minus, Settings,
    X, Eye, EyeOff, Loader2, Home, Camera, Trophy, BarChart3, LogOut, Info,
    ThumbsUp, Clock, BadgeCheck, UserCheck, Calendar, ChevronDown, ChevronLeft,
    ChevronRight, Bell, Video, Sparkles, Send, Lock, MessageCircle, Crosshair,
    FileBarChart, MoreHorizontal, CheckCircle, Rocket, Upload, LineChart,
    Building2, Headphones, Flame, Medal, Trash2, Download, UserCircle, Mail,
    Star, PictureInPicture2, Instagram, Github, Twitter
} from 'lucide-react';

// --- Icon Wrapper for Consistency ---
// Lucide icons are 24x24 by default. We apply the classNames passed from props.
interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

// --- RESTORED ORIGINAL BRAND LOGO ---
export const PoiséIcon = ({ className = "w-8 h-8", style }: IconProps) => (
    <svg
        width="93"
        height="58"
        viewBox="0 0 93 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} poise-logo transition-all duration-300 hover:scale-110`}
        style={style}
    >
        <path className="transition-all duration-300" d="M46.4354 0C20.7874 0 -0.00671193 21.1902 1.62519e-06 47.3216H11.8629C11.8629 27.7382 27.219 11.8606 46.4354 11.8606C65.6519 11.8606 81.008 27.7382 81.008 47.3216H92.8708C92.8753 21.1902 72.0812 0 46.4354 0Z" fill="currentColor" />
        <path className="poise-eye transition-all duration-500 hover:animate-pulse" d="M44.4494 47.2872C44.4494 44.4491 43.322 41.7271 41.3151 39.7203C39.3082 37.7134 36.5863 36.5859 33.7482 36.5859C30.91 36.5859 28.1881 37.7134 26.1812 39.7203C24.1743 41.7271 23.0469 44.4491 23.0469 47.2872L33.7482 47.2872H44.4494Z" fill="currentColor" />
        <path className="poise-eye transition-all duration-500 hover:animate-pulse" d="M69.7893 47.2872C69.7893 44.4491 68.6618 41.7271 66.6549 39.7203C64.6481 37.7134 61.9262 36.5859 59.088 36.5859C56.2498 36.5859 53.5279 37.7134 51.5211 39.7203C49.5142 41.7271 48.3867 44.4491 48.3867 47.2872L59.088 47.2872H69.7893Z" fill="currentColor" />
    </svg>
);

export const AppLogo = () => <PoiséIcon className="w-8 h-8" />;
export const AuthLogoIcon = () => <PoiséIcon className="w-12 h-12 text-gray-900 dark:text-white" />;

// --- Lucide Icon Mappings ---

export const SunIcon = ({ className }: IconProps) => <Sun className={className} />;
export const MoonIcon = ({ className }: IconProps) => <Moon className={className} />;
export const SearchIcon = ({ className }: IconProps) => <Search className={className} />;
export const ArrowRightIcon = ({ className }: IconProps) => <ArrowRight className={className} />;
export const AppIcon = ({ className }: IconProps) => <LayoutGrid className={className} />;
export const GhoIcon = ({ className }: IconProps) => <Wallet className={className} />;
export const BarChartIcon = ({ className }: IconProps) => <BarChart2 className={className} />;
export const BrandIcon = ({ className }: IconProps) => <Zap className={className} />;
export const FaqIcon = ({ className }: IconProps) => <HelpCircle className={className} />;
export const HelpIcon = ({ className }: IconProps) => <LifeBuoy className={className} />;
export const GovernanceIcon = ({ className }: IconProps) => <Landmark className={className} />;
export const BuildIcon = ({ className }: IconProps) => <Hammer className={className} />;
export const DocsIcon = ({ className }: IconProps) => <FileText className={className} />;
export const SecurityIcon = ({ className }: IconProps) => <ShieldCheck className={className} />;
export const BugBountyIcon = ({ className }: IconProps) => <Bug className={className} />;
export const PlusIcon = ({ className }: IconProps) => <Plus className={className} />;
export const MinusIcon = ({ className }: IconProps) => <Minus className={className} />;
export const SettingsIcon = ({ className }: IconProps) => <Settings className={className} />;
export const CloseIcon = ({ className }: IconProps) => <X className={className} />;
export const GoogleIcon = ({ className = "w-5 h-5" }: IconProps) => (
    // Google is not in Lucide, keeping SVG
    <svg className={className} viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.68,44,31.13,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
);
export const EyeIcon = ({ className }: IconProps) => <Eye className={className} />;
export const EyeOffIcon = ({ className }: IconProps) => <EyeOff className={className} />;
export const LoaderIcon = ({ className }: IconProps) => <Loader2 className={`animate-spin ${className}`} />;
export const HomeIcon = ({ className }: IconProps) => <Home className={className} />;
export const CameraIcon = ({ className }: IconProps) => <Camera className={className} />;
export const TrophyIcon = ({ className }: IconProps) => <Trophy className={className} />;
export const ChartBarSquareIcon = ({ className }: IconProps) => <BarChart3 className={className} />;
export const LogoutIcon = ({ className }: IconProps) => <LogOut className={className} />;
export const InfoCircleIcon = ({ className }: IconProps) => <Info className={className} />;
export const ThumbsUpIcon = ({ className }: IconProps) => <ThumbsUp className={className} />;
export const ClockIcon = ({ className }: IconProps) => <Clock className={className} />;
export const CheckBadgeIcon = ({ className }: IconProps) => <BadgeCheck className={className} />;
export const UserCheckIcon = ({ className }: IconProps) => <UserCheck className={className} />;
export const CalendarIcon = ({ className }: IconProps) => <Calendar className={className} />;
export const ChevronDownIcon = ({ className }: IconProps) => <ChevronDown className={className} />;
export const BellIcon = ({ className }: IconProps) => <Bell className={className} />;
export const VideoCameraIcon = ({ className }: IconProps) => <Video className={className} />;
export const SparklesIcon = ({ className }: IconProps) => <Sparkles className={className} />;
export const SendIcon = ({ className }: IconProps) => <Send className={className} />;
export const LockClosedIcon = ({ className }: IconProps) => <Lock className={className} />;
export const ChatBubbleIcon = ({ className }: IconProps) => <MessageCircle className={className} />;
export const ChevronLeftIcon = ({ className }: IconProps) => <ChevronLeft className={className} />;
export const ChevronRightIcon = ({ className }: IconProps) => <ChevronRight className={className} />;
export const TargetIcon = ({ className }: IconProps) => <Crosshair className={className} />;
export const ReportsIcon = ({ className }: IconProps) => <FileBarChart className={className} />;
export const DotsHorizontal = ({ className }: IconProps) => <MoreHorizontal className={className} />;
export const CheckCircleIcon = ({ className }: IconProps) => <CheckCircle className={className} />;
export const RocketLaunchIcon = ({ className }: IconProps) => <Rocket className={className} />;
export const UploadIcon = ({ className }: IconProps) => <Upload className={className} />;
export const BoltIcon = ({ className }: IconProps) => <Zap className={className} />;
export const PresentationChartLineIcon = ({ className }: IconProps) => <LineChart className={className} />;
export const BuildingOfficeIcon = ({ className }: IconProps) => <Building2 className={className} />;
export const HeadphonesIcon = ({ className }: IconProps) => <Headphones className={className} />;
export const FireIcon = ({ className }: IconProps) => <Flame className={className} />;
export const MedalIcon = ({ className }: IconProps) => <Medal className={className} />;
export const TrashIcon = ({ className }: IconProps) => <Trash2 className={className} />;
export const DownloadIcon = ({ className }: IconProps) => <Download className={className} />;
export const DocumentTextIcon = ({ className }: IconProps) => <FileText className={className} />;
export const UserCircleIcon = ({ className }: IconProps) => <UserCircle className={className} />;
export const EnvelopeIcon = ({ className }: IconProps) => <Mail className={className} />;
export const StarIcon = ({ className }: IconProps) => <Star className={className} />;
export const PictureInPictureIcon = ({ className }: IconProps) => <PictureInPicture2 className={className} />;

// --- Social Icons ---
// Using Lucide where available, or basic SVGs for others
export const XIcon = ({ className }: IconProps) => <Twitter className={className} />; // Twitter/X equiv
export const GithubIcon = ({ className }: IconProps) => <Github className={className} />;
export const InstagramIcon = ({ className }: IconProps) => <Instagram className={className} />;
export const MediumIcon = ({ className = "w-5 h-5" }: IconProps) => (
    // Medium not in Lucide regular
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10c2.76 0 5 2.24 5 5v10c0 2.76-2.24 5-5 5H7c-2.76 0-5-2.24-5-5V7c0-2.76 2.24-5 5-5zm4 6.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v1zm5.5 0c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v1zm-3.5 5c0 .28-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v1z" /></svg>
);
// Restoring Discord SVG as it's cleaner/specific
export const DiscordIcon = ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.369-.42.839-.579 1.239a18.28 18.28 0 00-3.658 0 18.278 18.278 0 00-.579-1.239.074.074 0 00-.079-.037A19.736 19.736 0 003.683 4.37a.077.077 0 00-.035.079C3.388 6.273 3.218 8.44 3.218 10.615c0 6.088 2.903 7.615 2.903 7.615a.075.075 0 00.086-.046c.21-.39.419-.81.588-1.229a.074.074 0 00-.046-.086c-.419-.17-.828-.37-1.228-.618a.075.075 0 00-.086.037c-.03.046-.046.105-.046.147 0 .58.229 1.13.638 1.628a.075.075 0 00.086.046c.72-.25 1.44-.55 2.16-.9a.075.075 0 00.046-.086 16.29 16.29 0 00-1.23-2.218.075.075 0 00-.01-.116c.03-.01.046-.03.075-.046a13.16 13.16 0 006.268 0 .075.075 0 00.075.046c-.01.03-.03.06-.046.086-.01.03-.01.046-.01.075-.01.03-.01.046 0 .075a16.29 16.29 0 00-1.23 2.228.075.075 0 00.046.086c.72.35 1.44.65 2.16.9a.075.075 0 00.086-.046c.409-.498.638-1.048.638-1.628a.075.075 0 00-.046-.147c-.01-.01-.03-.03-.046-.046a.075.075 0 00-.086-.037c-.4.248-.81.448-1.229.618a.075.075 0 00-.046.086c.17.42.38.84.59 1.23a.075.075 0 00.086.046c0 0 2.903-1.527 2.903-7.615 0-2.175-.17-4.342-.43-6.246a.077.077 0 00-.035-.08z" /></svg>
);
// Keeping Lens as SVG as well
export const LensIcon = ({ className = "w-5 h-5" }: IconProps) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9h5v2h-5v-2zm-2.5-2.5h10v2h-10v-2z" /></svg>;
