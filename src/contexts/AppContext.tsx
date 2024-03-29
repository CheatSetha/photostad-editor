import { PanelType } from "~/constants/app-options"
import React, { createContext, useState } from "react"

type Template = any
interface IAppContext {
  isMobile: boolean | undefined
  setIsMobile: React.Dispatch<React.SetStateAction<boolean | undefined>>
  templates: Template[]
  setTemplates: (templates: Template[]) => void
  uploads: any[]
  setUploads: (templates: any[]) => void
  shapes: any[]
  setShapes: (templates: any[]) => void
  activePanel: PanelType
  setActivePanel: (option: PanelType) => void
  activeSubMenu: string | null
  setActiveSubMenu: (option: string) => void
  currentTemplate: any
  setCurrentTemplate: any
  uploadTemp: any
  setUploadTemp: any
  currentUser: any
  setCurrentUser: any
  blobList: any
  setBlobList: any


}

export const AppContext = createContext<IAppContext>({
  isMobile: false,
  setIsMobile: () => {},
  templates: [],
  setTemplates: () => {},
  uploads: [],
  setUploads: () => {},
  shapes: [],
  setShapes: () => {},
  activePanel: PanelType.TEMPLATES,
  setActivePanel: () => {},
  activeSubMenu: null,
  setActiveSubMenu: (value: string) => {},
  currentTemplate: {},
  setCurrentTemplate: {},
  uploadTemp: {},
  setUploadTemp: {},
  currentUser: {},
  setCurrentUser: {},
  blobList: {},
  setBlobList: {},
 
 
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [templates, setTemplates] = useState<Template[]>([])
  const [uploads, setUploads] = useState<any[]>([])
  const [shapes, setShapes] = useState<Template[]>([])
  const [activePanel, setActivePanel] = useState<PanelType>(PanelType.TEMPLATES)
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [uploadTemp, setUploadTemp] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [blobList, setBlobList] = useState(null)


  const context = {
    isMobile,
    setIsMobile,
    templates,
    setTemplates,
    activePanel,
    setActivePanel,
    shapes,
    setShapes,
    activeSubMenu,
    setActiveSubMenu,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    uploadTemp,
    setUploadTemp,
    currentUser,
    setCurrentUser,
    blobList,
    setBlobList,
   
    
    
  }
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
