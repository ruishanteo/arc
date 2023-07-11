import { useSelector } from "react-redux";

import { 
  TableContainer, 
  TableHead, 
  TableBody, 
  Table, 
  TableCell, 
  TableRow, 
  Typography 
} from "@mui/material";

export function ProgRequirements() {
    let progMods = require('../module_data/progMods.json');
    let secondProg = require('../module_data/secondProg.json');

    const degrees = useSelector((state) => state.plannerDeg.degrees);
    const semesters = useSelector((state) => state.plannerSem.semesters);

    function getDegreeTitle() {
      if (typeof degrees[0]?.title != 'undefined') {
        return degrees[0]?.title;
      }
      return "";
    }
    
    const deg = getDegreeTitle();

    function getSecDegreeTitle() {
      if (typeof degrees[1]?.title != 'undefined') {
        return degrees[1]?.title;
      }
      return "";
    }
    
    const secDeg = getSecDegreeTitle();

    function checkValues(arr, list) {
      if (Array.isArray(arr)) {
        return arr.some(value => {
          return checkValues(value, list)});
      } else {
        // Check if the single value is present
        return list.includes(arr);
      }
    }

    function checkcsbreadth() {
      let data = require('../module_data/csbreadth.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      for (const list of Object.values(data)) {
        const count = arr.filter(module => list.filter(listModule => listModule.moduleCode === module)).length;
        if (count >= 3) {
          return "#cff8df";
        }
      }
      return "#FFFFFF";
    }

    function checkMin(titleArr) {
      let data = require('../module_data/modCheck.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres;
      if (titleArr[2].length <= 3) {
        const pres1 = arr.filter(moduleCode => moduleCode.includes(titleArr[2]));
        const recog = titleArr[2] + "-recognised"
        const pres2 = arr.filter(moduleCode => data[recog].includes(moduleCode))
        pres = Array.from(new Set(pres1.concat(pres2)));
      } else {
        pres = arr.filter(moduleCode => data[titleArr[2]].includes(moduleCode))
      }
      if (titleArr.length >= 4) {
        pres = pres.filter(moduleCode => {
          const match = moduleCode.match(/\d/);
          const firstDigit = parseInt(match[0], 10);
          return firstDigit >= Number(titleArr[3]);
        })
      }
      if (pres.length * 4 >= Number(titleArr[1])) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkMax(titleArr) {
      let data = require('../module_data/modCheck.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres;
      if (titleArr[2].length <= 3) {
        const pres1 = arr.filter(moduleCode => moduleCode.includes(titleArr[2]));
        const recog = titleArr[2] + "-recognised"
        const pres2 = arr.filter(moduleCode => data[recog].includes(moduleCode))
        pres = Array.from(new Set(pres1.concat(pres2)));
      } else {
        pres = arr.filter(moduleCode => data[titleArr[2]].includes(moduleCode))
      }
      if (titleArr.length >= 4) {
        pres = pres.filter(moduleCode => {
          const match = moduleCode.match(/\d/);
          const firstDigit = parseInt(match[0], 10);
          return firstDigit >= Number(titleArr[3]);
        })
      }
      if (pres.length * 4 > Number(titleArr[1])) {
        return "#941C0E";
      }
      return "#cff8df";
    }

    function basicCheck(titleArr) {
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      const present = titleArr.find(title => checkValues(title, arr));
      if (present) {
        return "#cff8df";
      } else {
        return "#FFFFFF";
      }
    }

    function checkbzaelec() {
      let data = require('../module_data/modCheck.json')["BZA Programme Electives"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.length >= 5 && pres.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit >= Number(4);
      }).length >= 3 && pres.filter(moduleCode => moduleCode.includes("BT")).length >= 3 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkiselec() {
      let data = require('../module_data/modCheck.json')["IS Programme Electives"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.length >= 5 && pres.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit >= Number(4);
      }).length >= 3 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkcomreq() {
      let data = require('../module_data/modCheck.json')["Industry Experience"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => moduleCode.includes("CS") || moduleCode.includes("IS") || moduleCode.includes("CP"));
      if (pres.filter(moduleCode => data.includes(moduleCode)).length >= 1 && pres.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit >= Number(3);
      }).length >= 1 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkGLtheme() {
      let data = require('../module_data/gltheme.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      for (const list of Object.values(data)) {
        const count = arr.filter(module => list.filter(listModule => listModule.moduleCode === module)).length;
        if (count >= 3) {
          return "#cff8df";
        }
      }
      return "#FFFFFF";
    }

    function checkFSspec() {
      let data = require('../module_data/modCheck.json')["Food Sci Spec"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres;
      if (arr.includes("FST4288")) {
        pres = arr.filter(moduleCode => data[0][1].includes(moduleCode))
        if (pres.length >= 2) {
          return "#cff8df";
        }
      }
      if (arr.includes("FST4277") && arr.includes("FST4278")) {
        pres = arr.filter(moduleCode => data[1][2].includes(moduleCode))
        if (pres.length >= 1) {
          return "#cff8df";
        }
      }
      return "#FFFFFF";
    }

    function checkLSM() {
      let data = require('../module_data/modCheck.json')["LSM Specific"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.filter(moduleCode => moduleCode.includes("LSM22")).length <= 2 && 
      pres.filter(moduleCode => moduleCode.includes("LSM42") || moduleCode.includes("LSM4991")).length >= 3) {
        const moduleCodesToCheck8 = ["LSM4288M", "LSM4288C", "LSM4288E", "LSM4288X"];
        const moduleCodesToCheck4 = ["LSM3288", "LSM3288R", "LSM2288", "LSM2288R"];
        if (arr.some(moduleCode => moduleCodesToCheck8.includes(moduleCode))) {
          const filt = pres.filter(moduleCode => moduleCode.includes("LSM42") || moduleCode.includes("LSM22"));
          const filt2 = pres.filter(moduleCode => moduleCode.includes("LSM3991") || moduleCode.includes("LSM4991"));
          let filt2Length = 0;
          if (filt2.length > 0) {
            filt2Length = 1;
          } 
          if ((filt.length + filt2Length) >= 8 ) {
            return "#cff8df";
          }         
        }
        if (arr.some(moduleCode => moduleCodesToCheck4.includes(moduleCode))) {
          const filt = pres.filter(moduleCode => moduleCode.includes("LSM42") || moduleCode.includes("LSM22"));
          const filt2 = pres.filter(moduleCode => moduleCode.includes("LSM3991") || moduleCode.includes("LSM4991"));
          let filt2Length = 0;
          if (filt2.length > 0) {
            filt2Length = 1;
          } 
          if ((filt.length + filt2Length) >= 9 ) {
            return "#cff8df";
          }         
        }
      }
      return "#FFFFFF";
    }

    function checkMA2additional() {
      let data = require('../module_data/modCheck.json')["MA 2 additional"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.length >= 2) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkMA5additional() {
      let data = require('../module_data/modCheck.json')["MA 5 additional"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.length >= 2) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkST3additional() {
      let data = require('../module_data/modCheck.json')["ST 3 additional"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (pres.length >= 3) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkST4additional() {
      let data = require('../module_data/modCheck.json')["ST 4 additional"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let pres = arr.filter(moduleCode => data.includes(moduleCode));
      if (arr.includes("ST4288")) {
        if (pres.length >= 2) {
          return "#cff8df";
        }
      }      
      if (pres.length >= 4) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkBizSpec() {
      let data = require('../module_data/bizspec.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let condition1;
      let condition2;
      for (const list of Object.values(data)) {
        const count = 5 - list[0].length;
        if (list[0] === [["BSN3701", "TR3008"], ["BSN3702", "TR3002N"]]) {
          condition1 = list[0].every(pair => pair.some(element => arr.includes(element)));
        } else {
          condition1 = list[0].every(element => arr.includes(element));
        }
        const filt = arr.filter(moduleCode => list[1].includes(moduleCode));
        if (filt.length >= count) {
          condition2 = true;
        } else {
          condition2 = false;
        }
        if (condition1 && condition2) {
          return "#cff8df";
        }
      }
      return "#FFFFFF";
    }

    function checkBizHonours() {
      let data = require('../module_data/modCheck.json')["Biz Honours Programme"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      if (arr.includes("BHD4001")) {
        if (arr.filer(moduleCode => data[0].includes(moduleCode).length >= 2 || arr.includes("FSP4003"))) {
          return "#cff8df";
        }
      }
      if (arr.includes("FSP4003")) {
        if (arr.filer(moduleCode => data[1].includes(moduleCode).length >= 3)) {
          return "#cff8df";
        }
      }
      return "#FFFFFF";
    }

    function checkManagement4() {
      let data = require('../module_data/modCheck.json')["Management Maj 4"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let count = 0;
      for (const group of data) {
        const presentElements = group.filter(element => arr.includes(element));
        if (presentElements.length > 0) {
          count++;
        } 
      }
      if (count >= 4) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkManagement2k() {
      let data = require('../module_data/modCheck.json')["Management Maj 6"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let present = [];
      for (const group of data) {
        const presentElements = group.filter(element => arr.includes(element));
        present = present.concat(presentElements);
      }
      if (present.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit === Number(2);
      }).length >= 2 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkManagement3k() {
      let data = require('../module_data/modCheck.json')["Management Maj 6"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let present = [];
      for (const group of data) {
        const presentElements = group.filter(element => arr.includes(element));
        present = present.concat(presentElements);
      }
      if (present.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit === Number(3);
      }).length >= 3 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkManagement3kMax() {
      let data = require('../module_data/modCheck.json')["Management Maj 6"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let present = [];
      for (const group of data) {
        const presentElements = group.filter(element => arr.includes(element));
        present = present.concat(presentElements);
      }
      if (present.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit === Number(3);
      }).length >= 4 ) {
        return "#941C0E";
      }
      return "#FFFFFF";
    }

    function checkManagementMax() {
      let data = require('../module_data/modCheck.json')["Management Maj 6"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      for (const group of data) {
        const presentElements = group.filter(element => arr.includes(element));
        if (presentElements.length > 3) {
          return "#941C0E";
        }
      }
      return "#FFFFFF";
    }
    
    function checkInfoSecMaj() {
      let data = require('../module_data/modCheck.json')["InfoSec Maj"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let present = arr.filter(moduleCode => data.includes(moduleCode));
      if (present.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit === Number(3);
      }).length >= 2 && present.length >= 3 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    function checkPhysicsMaj() {
      let data = require('../module_data/modCheck.json')["Physics Maj"];
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      let present = arr.filter(moduleCode => data.includes(moduleCode));
      if (present.filter(moduleCode => {
        const match = moduleCode.match(/\d/);
        const firstDigit = parseInt(match[0], 10);
        return firstDigit === Number(3);
      }).length >= 3 && present.length >= 5 ) {
        return "#cff8df";
      }
      return "#FFFFFF";
    }

    //Industry Experience Requirement
    //PC UPIP COURSE
    //NOC internship course
    //Any UPIP/FASSIP module
    //Students should not read more than 60 Units of level 1000 modules towards their degree requirements.
    //CS-coded and IS-coded courses must be at level-3000 or above. At least 6 units must consist of industrial experience courses.
    function checkPresent(titleArr) {
      if (titleArr.length === 0) {
        return "#E0FBFF"
      } else if (titleArr[0] === "min") {
        return checkMin(titleArr)
      } else if (titleArr[0] === "max") {
        return checkMax(titleArr);
      } else if (titleArr[0] === "Computer Science Breadth & Depth") {
        return checkcsbreadth()
      } else if (titleArr[0] === "BZA Programme Electives") {
        //Complete 5 Business Analytics programme elective courses with at least 3 courses at Level-4000, and at least 3 must be BT-coded courses.
        return checkbzaelec()
      } else if (titleArr[0] === "IS Programme Electives") {
        //Complete 5 Information Systems programme elective courses with at least 3 courses at Level-4000
        return checkiselec()
      } else if (titleArr[0] === "Computing Requirements") {
        //Complete 12 units of CS-coded, IS-coded, or CP-coded courses subject to the following conditions:CS-coded and IS-coded courses must be at level-3000 or above.At least 6 units must consist of industrial experience courses.
        return checkcomreq()
      } else if (titleArr[0] === "GL theme") {
        return checkGLtheme()
      } else if (titleArr[0] === "Food Sci Specialisation") {
        return checkFSspec()
      } else if (titleArr[0] === "LSM Specific") {
        return checkLSM()
      } else if (titleArr[0] === "MA 2 additional") {
        return checkMA2additional()
      } else if (titleArr[0] === "MA 5 additional") {
        return checkMA5additional()
      } else if (titleArr[0] === "ST 3 additional") {
        return checkST3additional()
      } else if (titleArr[0] === "ST 4 additional") {
        //4 modules from ST42xx (except ST4288) OR (2 modules from ST42xx AND ST4288)
        return checkST4additional()
      } else if (titleArr[0] === "Biz Specialisation") {
        return checkBizSpec()
      } else if (titleArr[0] === "Biz Honours Programme") {
        return checkBizHonours()
      } else if (titleArr[0] === "Management Maj 4") {
        return checkManagement4()
      } else if (titleArr[0] === "Management Maj 2k") {
        return checkManagement2k()
      } else if (titleArr[0] === "Management Maj 3k") {
        return checkManagement3k()
      } else if (titleArr[0] === "Management Maj 3k max") {
        return checkManagement3kMax()
      } else if (titleArr[0] === "Management Maj max") {
        return checkManagementMax()
      } else if (titleArr[0] === "InfoSec Maj") {
        return checkInfoSecMaj()
      } else if (titleArr[0] === "Physics Maj") {
        return checkPhysicsMaj()
      } else {
        return basicCheck(titleArr)
      }
    }

    const tab = () => {
      if (deg in progMods) {
        return (
          progMods[deg].map((module, index) => {
            return (
              <TableRow 
                key={index}
                className="progTable1Rows">
              <TableCell 
                id={`prog-mod-table1-${index}`}
                className="progTable1Cell"
                align="center" 
                sx={{
                  backgroundColor: checkPresent(module.moduleCode),
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {module.title}
              </TableCell>
              </TableRow>
            )
          }))
      } else {
        return (
              <TableRow key = {1} className="progTable1Rows">
              <TableCell 
                id={`prog-mod-table1`}
                className="progTable1Cell"
                align="center" 
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {"Please select a degree"}
              </TableCell>
              </TableRow>
          );
      }
    }

    const tab2 = () => {
      if (secDeg in secondProg) {
        return (
          secondProg[secDeg].map((module, index) => {
            return (
              <TableRow 
                key={index}
                className="progTable2Rows">
              <TableCell 
                id={`prog-mod-table2-${index}`}
                className="progTable2Cell"
                align="center" 
                sx={{
                  backgroundColor: checkPresent(module.moduleCode),
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {module.title}
              </TableCell>
              </TableRow>
            )
          }))
      } else {
        return (
              <TableRow key = {2} className="progTable2Rows">
              </TableRow>
          );
      }
    }
    

    return (
        <>
        <TableContainer>
        <form>
        <Table aria-label="mod-table">
          <TableHead
          sx={{
            "& th": {
              backgroundColor: "#ffe0f7",
              color: "black",
              fontSize: "1.2rem",
            },
          }}>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                {" "}
                <Typography>Programme Requirements</Typography>{" "}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
              {tab()}
              {tab2()}
          </TableBody>
        </Table>
      </form>
    </TableContainer>
    </>
    );
}