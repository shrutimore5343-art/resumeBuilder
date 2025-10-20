import React, { useState, ChangeEvent } from "react";
import SvgSave from "../Public/SvgSave";
import classes from "../Styles/UploadImage.module.css";
import { useLocationLocalStorage } from "../Hook/LocationLocalStorage";
import { API_URL } from "../utils/config";
import useGenerateResume from "../Hook/useGenerateResume";

const UploadImage: React.FC = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { GenerateResume } = useGenerateResume();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [setImageToBackend, setsetImageToBackend] = useState<
    File | undefined
  >();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    setsetImageToBackend(file);
    if (file) {
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async (): Promise<any> => {
    if (selectedImage == null) return;
    console.log(setImageToBackend);
    const userId = fetchPersonalDetails().id;
    const formData = new FormData();
    if (setImageToBackend) {
      formData.append("file", setImageToBackend);
    }
    try {
      const response = await fetch(
        `${API_URL}/userimage/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responsedata = await response.json();
      console.log(responsedata);
      // After successfully saving the image on backend, re-generate the PDF
      // so the new image is included, then notify the PDF viewer to refresh.
      try {
        await GenerateResume(userId);
      } catch (e) {
        // ignore errors from auto-generation; PDF can be refreshed manually
        console.log("Auto-generate resume failed", e);
      }
      // dispatch a global event so the PDF viewer iframe can reload
      try {
        window.dispatchEvent(new CustomEvent("resumeGenerated", { detail: userId }));
      } catch (e) {
        // older browsers may not support CustomEvent constructor
        const evt: any = document.createEvent("CustomEvent");
        evt.initCustomEvent("resumeGenerated", false, false, userId);
        window.dispatchEvent(evt);
      }
      return responsedata.response;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.file_input_wrapper}>
      <input
        type="file"
        id="userimage"
        name="userimage"
        className={classes.file_input}
        onChange={handleFileUpload}
      />
      <div className={classes.part1_b_a}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Uploaded Image"
            style={{ maxWidth: "65px", maxHeight: "65px" }}
          />
        )}
      </div>
      <label htmlFor="userimage" className={classes.file_input_label}>
        Choose a file
      </label>
      <div
        className={classes.svgsave}
        onClick={() => {
          saveImage();
        }}
      >
        <SvgSave />
      </div>
    </div>
  );
};

export default UploadImage;
