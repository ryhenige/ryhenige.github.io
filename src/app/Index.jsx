import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Workout from "./pages/Workout/Workout"
import Chat from "./pages/Chat/Chat"
import Scene from "./pages/blue/scene"

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
          <Route path="/blue" element={<Scene />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </PageWrapper>
    </>
  )
}
