import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Go to top"
          className="fixed bottom-4 right-4 p-2 rounded-full bg-black/70 text-white shadow-lg hover:bg-white/30 hover:backdrop-blur-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none"

        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </>
  )
}

export default GoToTop

