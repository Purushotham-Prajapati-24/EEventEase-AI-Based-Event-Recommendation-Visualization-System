import { useEffect, useState } from "react"

const SCREEN_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const
export type ScreenSize = (typeof SCREEN_SIZES)[number]

const sizeOrder: Record<ScreenSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
} as const

export interface ComparableScreenSize {
  value: ScreenSize
  lessThan: (other: ScreenSize) => boolean
  greaterThan: (other: ScreenSize) => boolean
  lessThanOrEqual: (other: ScreenSize) => boolean
  greaterThanOrEqual: (other: ScreenSize) => boolean
}

const createComparable = (value: ScreenSize): ComparableScreenSize => ({
  value,
  lessThan: (other) => sizeOrder[value] < sizeOrder[other],
  greaterThan: (other) => sizeOrder[value] > sizeOrder[other],
  lessThanOrEqual: (other) => sizeOrder[value] <= sizeOrder[other],
  greaterThanOrEqual: (other) => sizeOrder[value] >= sizeOrder[other],
})

const useScreenSize = (): ComparableScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1536) setScreenSize("2xl")
      else if (width >= 1280) setScreenSize("xl")
      else if (width >= 1024) setScreenSize("lg")
      else if (width >= 768) setScreenSize("md")
      else if (width >= 640) setScreenSize("sm")
      else setScreenSize("xs")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return createComparable(screenSize)
}

export { useScreenSize }
