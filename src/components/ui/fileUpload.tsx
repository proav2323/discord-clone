"use client"

interface fileUploadProps {
    onChange: (url?: string) => void,
    endpoint: "messageFile" | "serverImage",
    value: string
}
export const FileUpload = ({onChange, endpoint, value}: fileUploadProps) => {
    return (
    <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    )
}