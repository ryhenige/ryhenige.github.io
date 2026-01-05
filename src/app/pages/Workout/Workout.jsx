import { useState } from 'react'
import Itinerary from './Itinerary'
import { WeekSpinner, WeekDay, Arrows, RelativeContainer } from './components/StyledComponents'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import Routine from './components/Routine'
import Stopwatch from './components/Stopwatch'

const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

export default function Workout() {
  useDocumentTitle('Workout')
  const d = new Date()
  const [day, setDay] = useState(d.getDay())

  const handleDayChange = (offset) => {
   let newDay = day + offset
   if (newDay < 0) {
     newDay = 6
   } else if (newDay > 6) {
     newDay = 0
   }
   setDay(newDay)
  }

  return (
    <>
      <RelativeContainer>
        <Stopwatch />
        <WeekSpinner>
          <Arrows align='right' onClick={() => handleDayChange(-1)}><FaChevronLeft size={16} /></Arrows>
          <WeekDay active>{weekdays[day].slice(0, 3)}</WeekDay>
          <Arrows align='left' onClick={() => handleDayChange(1)}><FaChevronRight size={16} /></Arrows>
        </WeekSpinner>
      </RelativeContainer>
      <div>
        <Routine routine={Itinerary[weekdays[day]]} />
      </div>
    </>
  )
}