import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button" // ButtonPropsをインポート
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const down = (event: KeyboardEvent) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && event.metaKey) {
          event.preventDefault()
          toggleSidebar()
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [toggleSidebar])

    React.useEffect(() => {
      if (!isMobile) {
        setOpenMobile(false)
      }
    }, [isMobile])

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_state, _setState] = React.useState<"expanded" | "collapsed">(
      open ? "expanded" : "collapsed"
    )
    const state = openProp ? (openProp ? "expanded" : "collapsed") : _state
    const setState = React.useCallback(
      (value: "expanded" | "collapsed") => {
        _setState(value)
        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${
          value === "expanded"
        }; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      []
    )

    const handleSidebar = () => {
      setState(state === "expanded" ? "collapsed" : "expanded")
      setOpen(state === "collapsed")
    }

    return (
      <SidebarContext.Provider
        value={{
          state,
          open,
          setOpen,
          openMobile,
          setOpenMobile,
          isMobile,
          toggleSidebar: handleSidebar,
        }}
      >
        <div
          className={cn(
            "relative h-screen",
            state === "collapsed" && "w-fit",
            state === "expanded" && "w-fit",
            className
          )}
          style={
            {
              "--sidebar-width":
                state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
          className
        )}
        style={{ width: "var(--sidebar-width)" }}
        ref={ref}
        {...props}
      />
      {isMobile && (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className={cn("w-[var(--sidebar-width-mobile)]", className)}
            {...props}
          />
        </Sheet>
      )}
    </>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("flex h-[3.56rem] items-center px-3", className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("grow overflow-y-auto p-3", className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "mt-auto flex items-center gap-2 border-t border-sidebar-border px-3 py-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>( // ButtonPropsを使用
  ({ className, variant = "ghost", size = "icon", ...props }, ref) => { // sizeのデフォルト値を 'icon' に
    const { toggleSidebar } = useSidebar()
    return (
      <Button // Buttonコンポーネントを使用
        variant={variant}
        size={size} // 修正: ButtonPropsで許容される型に
        onClick={toggleSidebar}
        className={cn("shrink-0", className)}
        ref={ref}
        {...props}
      >
        <PanelLeft />
      </Button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

const sidebarItemVariants = cva(
  cn(
    "flex h-9 w-full items-center justify-start gap-3 rounded-md px-2 text-sidebar-foreground transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-sidebar-accent"
  ),
  {
    variants: {
      active: {
        true: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
      },
    },
  }
)

export interface SidebarItemProps
  extends React.ComponentProps<typeof Slot>,
    VariantProps<typeof sidebarItemVariants> {
  icon?: React.ReactNode
  label: string
  tooltip?: boolean
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, label, tooltip = true, active, ...props }, ref) => {
    const { state } = useSidebar()
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip disableHoverableContent={!tooltip}>
          <TooltipTrigger asChild>
            <Slot
              className={cn(sidebarItemVariants({ active }), className)}
              ref={ref}
              {...props}
            >
              <>
                {icon}
                {state === "expanded" && (
                  <span className="w-full truncate text-sm">{label}</span>
                )}
              </>
            </Slot>
          </TooltipTrigger>
          {state === "collapsed" && (
            <TooltipContent
              side="right"
              className="bg-sidebar text-sidebar-foreground"
            >
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

const SidebarSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <Input
      className={cn(state === "collapsed" && "hidden", className)}
      ref={ref}
      {...props}
    />
  )
})
SidebarSearch.displayName = "SidebarSearch"

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <Separator
      className={cn(
        state === "collapsed" && "mx-auto my-2 w-3/4",
        state === "expanded" && "my-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarSkeleton = ({
  items = 5,
  className,
  ...props
}: { items?: number } & React.ComponentProps<"div">) => {
  const { state } = useSidebar()
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {[...Array(items)].map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-9 w-full rounded-md",
            state === "collapsed" && "w-9"
          )}
        />
      ))}
    </div>
  )
}
SidebarSkeleton.displayName = "SidebarSkeleton"

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarTrigger,
  SidebarItem,
  SidebarSearch,
  SidebarSeparator,
  SidebarSkeleton,
  useSidebar,
}
