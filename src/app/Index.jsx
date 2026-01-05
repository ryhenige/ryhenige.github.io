import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Workout from "./pages/Workout/Workout"
import Chat from "./pages/Chat/Chat"
import Blue from "./pages/blue/Blue"

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
          <Route path="/blue" element={<Blue />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </PageWrapper>
    </>
  )
}
