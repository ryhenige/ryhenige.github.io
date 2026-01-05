import styled, { css } from "styled-components"

// room page
export const RelativeContainer = styled.div`
  position: relative; 
  width: min-content;
  margin: auto;
  margin-top: 20px;
`

export const AbsoluteContainer = styled.div`
  position: absolute;
  width: 100%;
  margin: auto;
  top: 50%;
`

export const WeekSpinner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: min-content;
  margin: 0 auto;
  position: relative;
`

export const WeekDay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: 32px;
  width: 120px;
  background-color: lightgray;
  border-radius: 5px;
`

export const Arrows = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  background-color: #89CFF0;
  ${props => props.align === 'right' && `border-radius: 5px 0 0 5px;`}
  ${props => props.align === 'left' && `border-radius: 0 5px 5px 0;`}

  &:hover {
    opacity: 0.8;
  }
`

export const CurrentExerciseContainer = styled.div`
  border: 2px solid transparent;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0 10px;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;

  ${props => props.isActive && `
    border-color: #89CFF0;
  `}
`

const Container = css`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 15px;
  margin: 10px auto;
  text-align: left;
  line-height: 1.5;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  flex-direction: row;
  justify-content: space-between;

  ${props => props.disabled && `
    opacity: 0.4;
    pointer-events: none;
  `}

  ${props => props.isLocked && `
    opacity: 0.15;
    pointer-events: none;
  `}
`
// Excercise
export const ExerciseContainer = styled.div`
  ${Container}
  background-color: #89CFF0;
`

export const RestContainer = styled.div`
  ${Container}
  background-color: lightgray;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const Text = styled.span`
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
`

export const StyledCheckbox = styled.input`
  width: 40px;
  height: 100%;
`