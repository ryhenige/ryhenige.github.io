import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Workout from "./pages/Workout/Workout"
import Chat from "./pages/Chat/Chat"
import BlueScene from "./pages/blue/Scene"

import { PageWrapper } from './pages/styles/StyledComponents'

export default function Index() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/blue" element={<BlueScene />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </PageWrapper>
    </>
  )
}
