export default function Dice(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : ""
  }

  return (
    <button style={styles} onClick={props.hold}>{props.value}</button>
  )
}