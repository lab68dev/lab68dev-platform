import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

function SvgBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function SparklesSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="m12 3 1.3 3.2L16.5 7.5l-3.2 1.3L12 12l-1.3-3.2-3.2-1.3 3.2-1.3L12 3Z" />
      <path d="m5 14 .8 2 2.2.8-2.2.8L5 20l-.8-2.2L2 16.8l2.2-.8L5 14Z" />
      <path d="m19 12 .8 2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8L19 12Z" />
    </SvgBase>
  )
}

export function RocketLaunchSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M14.5 4.5c-3 0-5.4 1.2-7.4 3.2L4 10.8l9.2 9.2 3.1-3.1c2-2 3.2-4.4 3.2-7.4-2.9 0-5.4-1.2-7.4-3.2Z" />
      <path d="M8.5 15.5 4 20l4.5-1.5" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </SvgBase>
  )
}

export function ArrowRightSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </SvgBase>
  )
}

export function CodeBracketSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="m8 6-4 6 4 6" />
      <path d="m16 6 4 6-4 6" />
      <path d="m13 4-2 16" />
    </SvgBase>
  )
}

export function UserGroupSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="16.5" cy="9" r="2" />
      <path d="M3.5 18c0-2.5 2.6-4.5 5.5-4.5s5.5 2 5.5 4.5" />
      <path d="M14.5 17.5c.4-1.8 2-3.1 4.2-3.1 1.1 0 2.1.3 2.8.9" />
    </SvgBase>
  )
}

export function BoltSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M13.5 2 5 13h5l-1 9 8.5-11h-5L13.5 2Z" />
    </SvgBase>
  )
}

export function ClipboardDocumentListSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 4h6a1 1 0 0 0 1-1V2H8v1a1 1 0 0 0 1 1Z" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </SvgBase>
  )
}

export function ChatBubbleLeftRightSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v6A2.5 2.5 0 0 1 14.5 15H9l-4 3v-3A2.5 2.5 0 0 1 4 12.5v-6Z" />
      <path d="M12 10.5A2.5 2.5 0 0 1 14.5 8h3A2.5 2.5 0 0 1 20 10.5v4A2.5 2.5 0 0 1 17.5 17H16l-2 2v-2" />
    </SvgBase>
  )
}

export function DocumentTextSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v4h4" />
      <path d="M10 12h6" />
      <path d="M10 16h6" />
    </SvgBase>
  )
}

export function LightBulbSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 1 3.8 10.6c-.9.8-1.3 1.5-1.6 2.4H9.8c-.3-.9-.7-1.6-1.6-2.4A6 6 0 0 1 12 3Z" />
    </SvgBase>
  )
}

export function FolderSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
    </SvgBase>
  )
}

export function PresentationChartLineSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M4 5h16v11H4z" />
      <path d="M10 16v3" />
      <path d="M8 19h8" />
      <path d="m7 12 3-2 2 1 4-3" />
    </SvgBase>
  )
}

export function FaceSmileSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M8.5 14.5c1 1.3 2.3 2 3.5 2s2.5-.7 3.5-2" />
    </SvgBase>
  )
}

export function BookOpenSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="M12 6c-1.8-1.4-4-2-6.5-2A1.5 1.5 0 0 0 4 5.5V18a1.5 1.5 0 0 0 1.5 1.5c2.5 0 4.7.6 6.5 2" />
      <path d="M12 6c1.8-1.4 4-2 6.5-2A1.5 1.5 0 0 1 20 5.5V18a1.5 1.5 0 0 1-1.5 1.5c-2.5 0-4.7.6-6.5 2" />
    </SvgBase>
  )
}

export function CalendarSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h3" />
      <path d="M13 14h3" />
      <path d="M8 18h3" />
    </SvgBase>
  )
}

export function LayersSvgIcon(props: IconProps) {
  return (
    <SvgBase {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </SvgBase>
  )
}