import React, { useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./authConfig.js";   //  your MSAL config
import Login from "./components/Login";        // Microsoft login
import UploadForm from "./components/UploadForm";
import SheetList from "./components/SheetList";
import ChartViewer from "./components/ChartViewer";
import "./App.css";

export default function App() {
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <h1>ExcelInCharts</h1>

        {/* Show Login if not logged in */}
        {!isLoggedIn ? (
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <>
            <div className="container">
              <div className="chart-container">
                <ChartViewer sheetId={selectedSheet} />
              </div>
              <div className="sheet-list">
                <SheetList onSelect={setSelectedSheet} />
              </div>
            </div>
            <div className="data-entry">
              <UploadForm onUploaded={(sheet) => setSelectedSheet(sheet.id)} />
            </div>
          </>
        )}
      </div>
  
    </MsalProvider>
  );
}
// import React, { useState } from "react";
// import UploadForm from "./components/UploadForm";
// import SheetList from "./components/SheetList";
// import ChartViewer from "./components/ChartViewer";
// import "./App.css";

// export default function App() {
//   const [selectedSheet, setSelectedSheet] = useState(null);

//   return (
//     <div className="App">
//       <h1>Excel to Charts</h1>
//       <div className="container">
//         <div className="chart-container">
//           <ChartViewer sheetId={selectedSheet} />
//         </div>
//         <div className="sheet-list">
//           <SheetList onSelect={setSelectedSheet} />
//         </div>
//       </div>
//       <div className="data-entry">
//         <UploadForm onUploaded={(sheet) => setSelectedSheet(sheet.id)} />
//       </div>
//     </div>
//   );
// }


  