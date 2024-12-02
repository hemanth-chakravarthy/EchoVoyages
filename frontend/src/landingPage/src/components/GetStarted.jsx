import { useState } from 'react'
import { ArrowUpIcon } from 'lucide-react'

export default function Component() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="w-[250px] h-[70px] rounded-full p-[2px] cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-full h-full backdrop-blur-sm bg-black bg-opacity-60 rounded-full transition-all duration-300 ease-in-out shadow-lg">

        <p className="font-medium text-lg mr-2 text-white">
          <span className="text-gradient">Get</span>
        </p>
        <p className="font-medium text-lg text-white">
          <span className="text-gradient">Started</span>
        </p>
        
        <ArrowUpIcon
          className={`w-6 h-6 ml-2 transition-transform duration-300 ease-in-out ${isHovered ? 'translate-y-[-4px]' : ''} text-white`}
        />
      </div>
    </div>
  )
}
