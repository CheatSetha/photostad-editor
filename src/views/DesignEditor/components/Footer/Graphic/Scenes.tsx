import React, { useContext } from "react"
import { useStyletron } from "baseui"
import Add from "~/components/Icons/Add"
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { nanoid } from "nanoid"
import { getDefaultTemplate } from "~/constants/design-editor"
import { useEditor, useFrame } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import { DndContext, closestCenter, PointerSensor, useSensor, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToFirstScrollableAncestor, restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import SceneItem from "./SceneItem"
import { Block } from "baseui/block"
import useContextMenuTimelineRequest from "~/hooks/useContextMenuTimelineRequest"
import SceneContextMenu from "./SceneContextMenu"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { AppContext } from "~/contexts/AppContext"

const Scenes = () => {
  const scenes = useDesignEditorPages()
  // distructure individual functions from DesignEditorContext
  const { setScenes, setContextMenuTimelineRequest, setCurrentScene, currentScene, setCurrentDesign, currentDesign } =
    React.useContext(DesignEditorContext)
  // editor is a reference to the DesignEditor instance and use for manipulating the design
  const editor = useEditor()
  const [css] = useStyletron()
  // currentPreview is a string of the current scene preview
  const [currentPreview, setCurrentPreview] = React.useState("")
  // frame is a reference to the current scene frame
  const frame = useFrame()
  // draggedScene reference to the scene being dragged
  const [draggedScene, setDraggedScene] = React.useState<IScene | null>(null)
  // contextMenuTimelineRequest is a reference to the context menu request. we can use this to show/hide the context menu
  const contextMenuTimelineRequest = useContextMenuTimelineRequest()
  // sensors is an array of sensors that we can use to detect drag events
  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  ]

  React.useEffect(() => {
    // check if the current scene is loaded in the editor
    if (editor && scenes && currentScene) {
      // console.log(scences,'scences in footer');
      // if edtor and scenes and currentScene are not null then check if the current scene is loaded in the editor
      // it's meant to check if the current scene is loaded in the editor and
      const isCurrentSceneLoaded = scenes.find((s) => s.id === currentScene?.id)
      // if the current scene is not loaded in the editor then set the current scene to the first scene in the scenes array
      if (!isCurrentSceneLoaded) {
        setCurrentScene(scenes[0])
      }
    }
  }, [editor, scenes, currentScene])
  // console.log(currentScene, "currentScene")


  // React.useEffect(() => {
  //   // watcher is a function that watches for changes in the editor and updates the current preview
  //   let watcher = async () => {
  //     const updatedTemplate = editor.scene.exportToJSON()
  //     const updatedPreview = (await editor.renderer.render(updatedTemplate)) as string
  //     setCurrentPreview(updatedPreview)
  //   }
  //   if (editor) {
  //     editor.on("history:changed", watcher)
  //   }
  //   return () => {
  //     if (editor) {
  //       editor.off("history:changed", watcher)
  //     }
  //   }
  // }, [editor])
  const scences = useDesignEditorScenes()
  const { uploads, setUploads } = useContext(AppContext)
  // console.log("upload in scecnes morning", uploads[0]?.height);
  // console.log("upload in scecnes morning", uploads[0]?.width);
  // console.log(frame, "frame");
  let resizedHeight = uploads[0]?.height || 800
  let resizedWidth = uploads[0]?.width || 1200

  //get the width and height of image that add to scene and assign to frame


  React.useEffect(() => {

    if (editor) {
      if (currentScene) {
        updateCurrentScene(currentScene)
      } else {
        const defaultTemplate = getDefaultTemplate({
          // width: 1200,
          // height: 1200,
          // set width and height to the current frame width and height base on width and height of added images
          width: frame?.width,
          height: frame?.height,
          // width: resizedWidth,
          // height: resizedHeight,
        })
        setCurrentDesign({
          id: nanoid(),
          frame: defaultTemplate.frame,
          metadata: {},
          name: "Untitled Design",
          preview:" ",
          scenes: [],
          type: "PRESENTATION",
        })
        editor.scene
          .importFromJSON(defaultTemplate)
          .then(() => {
            const initialDesign = editor.scene.exportToJSON() as any
            editor.renderer.render(initialDesign).then((data) => {
              setCurrentScene({ ...initialDesign, preview: data })
              setScenes([{ ...initialDesign, preview: data }])
            })
          })
          .catch(console.log)
      }
    }
  }, [editor, currentScene])

  const updateCurrentScene = React.useCallback(
    async (design: IScene) => {
      await editor.scene.importFromJSON(design)
      const updatedPreview = (await editor.renderer.render(design)) as string
      setCurrentPreview(updatedPreview)
    },
    [editor, currentScene]
  )



  // const changePage = React.useCallback(
  //   async (page: any) => {
  //     setCurrentPreview("")
  //     if (editor) {
  //       const updatedTemplate = editor.scene.exportToJSON()
  //       const updatedPreview = await editor.renderer.render(updatedTemplate)

  //       const updatedPages = scenes.map((p) => {
  //         if (p.id === updatedTemplate.id) {
  //           return { ...updatedTemplate, preview: updatedPreview }
  //         }
  //         return p
  //       }) as any[]

  //       setScenes(updatedPages)
  //       setCurrentScene(page)
  //     }
  //   },
  //   [editor, scenes, currentScene]
  // )

  const handleDragStart = (event: any) => {
    const draggedScene = scenes.find((s) => s.id === event.active.id)
    if (draggedScene) {
      setDraggedScene(draggedScene)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setScenes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setDraggedScene(null)
  }




  return (
    <DndContext
      modifiers={[restrictToFirstScrollableAncestor, restrictToHorizontalAxis]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className={css({ overflow: "auto", width: "1100px" })}>
        <Block
          id="TimelineItemsContainer"
          $style={{ padding: "0.25rem 0.75rem", background: "#ffffff", position: "relative" }}
        >
          <div className={css({ display: "flex", alignItems: "center" })}>
            {contextMenuTimelineRequest.visible && <SceneContextMenu />}
            <SortableContext items={scenes} strategy={horizontalListSortingStrategy}>
              {/* {scenes.map((s, i) => (
                <SceneItem
                  key={i}
                  isCurrentScene={s.id === currentScene?.id}
                  scene={s}
                  index={i}
                  // changePage={changePage}
                  preview={currentPreview && s.id === currentScene?.id ? currentPreview : s.preview ? s.preview : ""}
                /> 
              ))} */}

            </SortableContext>
            <DragOverlay>
              {draggedScene ? (
                <Block
                  $style={{
                    backgroundImage: `url(${draggedScene.preview})`,
                    backgroundSize: `${frame ? (frame.width * 70) / frame.height : 70}px 70px`,
                    height: "80px",
                    opacity: 0.75,
                  }}
                />
              ) : null}
            </DragOverlay>
          </div>
        </Block>
      </div>
    </DndContext>
  )
}

export default Scenes
