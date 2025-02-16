export default function Die(props) {
  const style = {
    backgroundColor: props.isHeld ? "#59E391" : ""
  }
  return (
    <button
      style={style}
      onClick={props.hold}
      aria-pressed={props.isHeld}
      aria-label={`Die value with ${props.value}, ${props.isHeld ? "held" : "not held"}`}
    >{props.value}</button>
  )
}