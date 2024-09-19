/* eslint-disable react/prop-types */
import { Controller } from "react-hook-form"
import { Editor } from "@tinymce/tinymce-react"

const RTE = ({name,control,label,defaultValue=""}) => {
  return (
    <div>
        {
            label && <label>{label}</label>
        }
      <Controller
      name={name || "content"}
      control={control}
      render={({feild: {onChange}}) => (
        <Editor
        initialValue={defaultValue}
        init={{
            branding: false,
            height: 500,
            menubar:false,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              background-color: #1e1e1e;
              color: #e0e0e0;
            } `
        }} 
        onEditorChange={onChange}
        />
      )}
      />
    </div>
  )
}

export default RTE
