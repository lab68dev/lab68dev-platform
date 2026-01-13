"use client"

import { 
  HomeIcon, 
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  BoltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

import {
  HomeIcon as HomeIconSolid,
  BellIcon as BellIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid'

import { CheckIcon as CheckIconMini } from '@heroicons/react/20/solid'

/**
 * Heroicons Demo Component
 * Demonstrates various use cases for Heroicons in the platform
 */
export function HeroiconsDemo() {
  return (
    <div className="p-8 space-y-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-primary" />
          Heroicons Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Examples of how to use Heroicons throughout the LAB68 platform
        </p>
      </div>

      {/* Navigation Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Navigation Icons</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
            <BellIcon className="h-5 w-5" />
            <span>Notifications</span>
          </button>
        </div>
      </section>

      {/* Outline vs Solid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Outline vs Solid Icons</h2>
        <div className="flex gap-8 items-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outline (Default)</p>
            <div className="flex gap-3">
              <HomeIcon className="h-8 w-8 text-primary" />
              <BellIcon className="h-8 w-8 text-primary" />
              <StarIconSolid className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Solid (Filled)</p>
            <div className="flex gap-3">
              <HomeIconSolid className="h-8 w-8 text-primary" />
              <BellIconSolid className="h-8 w-8 text-primary" />
              <StarIconSolid className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Status Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Status Icons</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/10">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-medium">Success</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Operation completed successfully
            </p>
          </div>
          <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
            <div className="flex items-center gap-2">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-600 dark:text-red-400 font-medium">Error</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Something went wrong
            </p>
          </div>
          <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">Warning</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Please review this action
            </p>
          </div>
          <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-500/10">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">Info</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Additional information available
            </p>
          </div>
        </div>
      </section>

      {/* Search Input */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Form Icons</h2>
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Button Icons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Primary Action
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            Secondary
            <ArrowRightIcon className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 group">
            <BoltIcon className="h-5 w-5" />
            Gradient Button
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Mini Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Mini Icons (20x20)</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckIconMini className="h-5 w-5 text-green-500" />
            <span className="text-sm">Item completed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIconMini className="h-5 w-5 text-green-500" />
            <span className="text-sm">Feature enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIconMini className="h-5 w-5 text-green-500" />
            <span className="text-sm">All systems operational</span>
          </div>
        </div>
      </section>

      {/* Icon Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Sizes</h2>
        <div className="flex items-end gap-4">
          <div className="text-center space-y-2">
            <HomeIcon className="h-4 w-4 mx-auto" />
            <p className="text-xs text-muted-foreground">h-4 w-4<br/>(16px)</p>
          </div>
          <div className="text-center space-y-2">
            <HomeIcon className="h-5 w-5 mx-auto" />
            <p className="text-xs text-muted-foreground">h-5 w-5<br/>(20px)</p>
          </div>
          <div className="text-center space-y-2">
            <HomeIcon className="h-6 w-6 mx-auto" />
            <p className="text-xs text-muted-foreground">h-6 w-6<br/>(24px)</p>
          </div>
          <div className="text-center space-y-2">
            <HomeIcon className="h-8 w-8 mx-auto" />
            <p className="text-xs text-muted-foreground">h-8 w-8<br/>(32px)</p>
          </div>
          <div className="text-center space-y-2">
            <HomeIcon className="h-10 w-10 mx-auto" />
            <p className="text-xs text-muted-foreground">h-10 w-10<br/>(40px)</p>
          </div>
        </div>
      </section>
    </div>
  )
}
