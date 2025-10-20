import React, { useEffect, useState } from "react";
import Style from "../Styles/Resume.module.css";
import SvgRefresh from "../Public/Svg";
import { API_URL } from "../utils/config";
import { useLocationLocalStorage } from "../Hook/LocationLocalStorage";
import useGenerateResume from "../Hook/useGenerateResume";
import { useDispatch, useSelector } from "react-redux";
import { saveField } from "../Store/ResumeSlice";

const Pdf: React.FC = () => {
  const dispatch = useDispatch();
  const [URLRESUME, setURLRESUME] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { GenerateResume } = useGenerateResume();

  useEffect(() => {
    const callingBacendForResumecreation = async () => {
      const { fetchPersonalDetails } = useLocationLocalStorage();
      const userId = fetchPersonalDetails().id;
      const response = await GenerateResume(userId);
      setURLRESUME(userId);
      setRefreshKey((prevKey) => prevKey + 1);
      Object.entries(response).forEach(([key, value]) => {
        dispatch(
          saveField({
            field: key,
            data: value,
          })
        );
      });
    };
    callingBacendForResumecreation();
    const onResumeGenerated = (e: any) => {
      const userId = e?.detail || URLRESUME;
      // bump refreshKey to force iframe reload
      setURLRESUME(userId);
      setRefreshKey((prevKey) => prevKey + 1);
    };
    window.addEventListener("resumeGenerated", onResumeGenerated as EventListener);
    return () => {
      window.removeEventListener("resumeGenerated", onResumeGenerated as EventListener);
    };
  }, []);

  const refreshHandler = async () => {
    const response = await GenerateResume(URLRESUME);
    console.log(response);
    setURLRESUME((prevURL) => prevURL);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className={Style.container_PDFPart}>
      <div className={Style.refresh}>
        <div className={Style.refreshText} onClick={refreshHandler}>
          <SvgRefresh />
          Refresh
        </div>
      </div>
      {URLRESUME ? (
        <iframe
          key={refreshKey}
          // append refreshKey as query param to avoid browser caching the PDF
          src={`${API_URL}/uploads/${URLRESUME}.pdf?r=${refreshKey}`}
          width="100%"
          height="600px"
          title="PDF Viewer"
        />
      ) : (
        <div>Generating PDF...</div>
      )}
    </div>
  );
};

export default Pdf;
