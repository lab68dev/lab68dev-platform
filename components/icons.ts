/**
 * Heroicons Icon Components
 * Centralized icon exports for consistent usage across the platform
 * Using Heroicons from @heroicons/react
 */

// Outline icons (24x24) - Default style for UI elements
export {
  // Navigation
  HomeIcon,
  Cog6ToothIcon as SettingsIcon,
  Squares2X2Icon as DashboardIcon,
  RectangleStackIcon as ProjectsIcon,
  SparklesIcon,
  UserGroupIcon as CommunityIcon,
  
  // Actions
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PencilIcon as EditIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ArrowUpTrayIcon as UploadIcon,
  DocumentDuplicateIcon as CopyIcon,
  ArrowPathIcon as RefreshIcon,
  XMarkIcon as CloseIcon,
  
  // User & Auth
  UserIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon,
  EnvelopeIcon,
  LockClosedIcon,
  LockOpenIcon,
  ShieldCheckIcon,
  KeyIcon,
  
  // Communication
  ChatBubbleLeftRightIcon as ChatIcon,
  BellIcon,
  PhoneIcon,
  AtSymbolIcon,
  
  // Status
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon as WarningIcon,
  InformationCircleIcon as InfoIcon,
  
  // Arrows & Chevrons
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  
  // Media & Files
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
  MusicalNoteIcon,
  FilmIcon,
  CloudIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  
  // UI Elements
  MagnifyingGlassIcon as SearchIcon,
  Bars3Icon as MenuIcon,
  AdjustmentsHorizontalIcon as FilterIcon,
  FunnelIcon,
  ListBulletIcon,
  Squares2X2Icon as GridIcon,
  TableCellsIcon,
  ViewColumnsIcon,
  
  // Misc
  StarIcon,
  HeartIcon,
  BoltIcon,
  FireIcon,
  SunIcon,
  MoonIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  LinkIcon,
  ShareIcon,
  BookmarkIcon,
  FlagIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  
  // Eye icons for visibility toggle
  EyeIcon,
  EyeSlashIcon,
  
  // Code & Development
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  ServerIcon,
  CircleStackIcon as DatabaseIcon,
  
  // Shopping & Commerce
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  
  // Tools
  WrenchScrewdriverIcon as ToolsIcon,
  BeakerIcon,
  CubeIcon,
  PuzzlePieceIcon,
  
} from '@heroicons/react/24/outline'

// Solid icons (24x24) - For filled/active states
export {
  HomeIcon as HomeIconSolid,
  Cog6ToothIcon as SettingsIconSolid,
  SparklesIcon as SparklesIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid,
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
  ExclamationTriangleIcon as WarningIconSolid,
  InformationCircleIcon as InfoIconSolid,
  BoltIcon as BoltIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from '@heroicons/react/24/solid'

// Mini icons (20x20) - For compact/inline usage
export {
  CheckIcon as CheckIconMini,
  XMarkIcon as CloseIconMini,
  PlusIcon as PlusIconMini,
  MinusIcon as MinusIconMini,
  ChevronRightIcon as ChevronRightIconMini,
  ChevronLeftIcon as ChevronLeftIconMini,
  ChevronUpIcon as ChevronUpIconMini,
  ChevronDownIcon as ChevronDownIconMini,
} from '@heroicons/react/20/solid'

/**
 * Usage Examples:
 * 
 * import { 
 *   HomeIcon, 
 *   SearchIcon, 
 *   UserIcon,
 *   HomeIconSolid 
 * } from '@/components/icons'
 * 
 * // Outline for default state
 * <HomeIcon className="h-6 w-6" />
 * 
 * // Solid for active state
 * <HomeIconSolid className="h-6 w-6 text-primary" />
 * 
 * // Mini for inline/compact
 * <CheckIconMini className="h-5 w-5" />
 */
