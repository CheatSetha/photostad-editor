import useEditorType from "~/hooks/useEditorType"
import SelectEditor from "./SelectEditor"
import GraphicEditor from "./GraphicEditor"
import PresentationEditor from "./PresentationEditor"
import VideoEditor from "./VideoEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"
import ContextMenu from "./components/ContextMenu"
import { set } from "lodash"
import useAppContext from "~/hooks/useAppContext"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"

const DesignEditorCertificate = () => {
  const editorType = useEditorType()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
// get uuid from url
  const routedUrl = location.search
  const uuid = routedUrl.substring(1)  // remove ? from url

// find user with this uuid
  const getUserinfo =  async ()=>{
    const respone = await fetch(`https://photostad-api.istad.co/api/v1/auth/check-uuid/${uuid}`)
    const data = await respone.json()
  
    setCurrentUser(data)
  }

  useEffect(()=>{
    getUserinfo()
  },[])

  
  const { displayPreview, setDisplayPreview,setEditorType } = useDesignEditorContext()
  setEditorType('PRESENTATION')

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      {
        {
          // NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </>
  )
}

export default DesignEditorCertificate
