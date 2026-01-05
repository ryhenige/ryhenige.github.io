import React from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"

const NavBar = styled.nav`
  background-color: #333;
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  align-items: center;
`

const StyledLink = styled(NavLink)`
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  transition: 200ms ease;
  text-underline-offset: 4px;

  &.active {
    color: lightblue;
  }

  &:hover {
    color: lightblue;
    text-decoration: underline;
  }
`

export default function Header() {
  return (
    <NavBar>
      <StyledLink to="/" end>Home</StyledLink>
      <StyledLink to="/about">About</StyledLink>
      <StyledLink to="/workout">Workout</StyledLink>
    </NavBar>
  )
}
