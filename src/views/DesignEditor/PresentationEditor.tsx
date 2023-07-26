import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"


// handler when reload page
window.addEventListener("beforeunload", (event) => {
  event.preventDefault()
  event.returnValue = ""
  const confirmationMessage = "Are you sure you want to leave this page?"
  event.returnValue = confirmationMessage
  return confirmationMessage
})
const PresentationEditor = () => {
  return (
    <EditorContainer>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Toolbox />
          <Canvas />
          <Footer />
        </div>
      </div>
    </EditorContainer>
  )
}

export default PresentationEditor
