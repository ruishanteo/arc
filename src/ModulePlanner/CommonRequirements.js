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

export function CommonRequirements() {
    let commonMods = require('../module_data/commonMods.json');    
    const degrees = useSelector((state) => state.plannerDeg.degrees);
    const semesters = useSelector((state) => state.plannerSem.semesters);
    const color = "#cff8df";

    function getDegreeFaculty() {
        if (typeof degrees[0]?.faculty != 'undefined') {
          return degrees[0]?.faculty;
        }
        return "";
    }
    
    function getProg() {
        if (typeof degrees[2]?.title != 'undefined') {
            return degrees[2]?.title;
        }
        return "";
    }

    const deg = getDegreeFaculty();
    //cd Any course from Chemistry, Physics, or Biological Sciences departments starting with codes PC, CM, LSM respectively.
    //separeate one to get the programme
    //rc4 - 1 junior, 1 senior uts, 1 senior utc, 1 iec, 1 Digital Literacy or Data Literacy
    //capt - 1 junior, 2 senior, 1 iec, 1 Digital Literacy or Data Literacy

    const prog = getProg();

    function cdid_check(arr, data) {
        let idCount = 0;
        let cdCount = 0;
    
        arr.forEach(code => {
          if (idCount === 3 || (idCount === 2 && cdCount === 1)) {
            return; // Exit loop if conditions already met
          }
          
          const foundInID = data.ID.some(item => item.moduleCode === code);
          const foundInCD = data.CD.some(item => item.moduleCode === code);
          
          if (foundInID) {
            idCount++;
          } else if (foundInCD) {
            cdCount++;
          }
        });
    
        if (idCount === 3 || (idCount === 2 && cdCount === 1)) {
          return true;
        } else {
          return false;
        }
    }
      
    function checkPresentCommonMod(inputString) {
      let commonMod = require('../module_data/' + inputString + '.json');
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      if (inputString === "cdid") {
        if (cdid_check(arr, commonMod)) {
          return color;
        } else {
          return "#FFFFFF";
        }
      } else if (inputString === "integratedproj") {
        commonMod = commonMod[degrees[0].title];
        const hasCommonElement = arr.includes(commonMod.title);
        if (hasCommonElement) {
          return color;
        } else {
          return "#FFFFFF";
        }
      } else {
        const hasCommonElement = commonMod.some((element) => arr.includes(element.moduleCode));
        if (hasCommonElement) {
          return color;
        } else {
          return "#FFFFFF";
        }
      }
    }
  
    function checkPresentCommonModRC(prog, inputString) {
      const program = prog.toLowerCase();
      let commonMod;
      if (inputString === "gei") {
        commonMod = require('../module_data/utcpgei.json');
      } else {
        commonMod = require('../module_data/' + program + inputString + '.json');
      }    
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));;
      const hasCommonElement = commonMod.some((element) => arr.includes(element.moduleCode));
      if (hasCommonElement) {
        return color;
      } else {
        return "#FFFFFF";
      }
    }
    
    const tab = () => {
        if (deg !== "") {
        if (prog === "RC4" || prog === "Tembusu" || prog === "CAPT") {
            let specProg = require('../module_data/utcp.json');
          return (
          specProg.map((module, index) => {
              return (
              <TableRow key={index}>
              <TableCell align="center" sx={{
                  backgroundColor: checkPresentCommonModRC(prog, module.code),
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {module.title}
              </TableCell>
              </TableRow>
              )
          }))
        } else if (prog === "NUSC") {
            let specProg = require('../module_data/nusc.json');
          return (
          specProg.map((module, index) => {
              return (
              <TableRow key={index}>
              <TableCell align="center" sx={{
                  backgroundColor: checkPresentCommonMod(module.code),
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {module.title}
              </TableCell>
              </TableRow>
              )
          }))
        } else {
            let nonProg = require('../module_data/nonprog.json');
            return (
                nonProg.map((module, index) => {
                    return (
                    <TableRow key={index}>
                    <TableCell align="center" sx={{
                        backgroundColor: checkPresentCommonMod(module.code),
                        color: "black",
                        fontSize: "1.0rem",
                    }}>
                        {module.title}
                    </TableCell>
                    </TableRow>
                    )
                }))
        }
      } else {
        return (
              <TableRow key = {1}>
              <TableCell align="center" sx={{
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
        if (prog === "NUSC") {
            return (
                <TableRow key = {2}>
    
                </TableRow>
            );
        } else if (deg !== "") {
        return (
        commonMods[deg].map((module, index) => {
            return (
            <TableRow key={index}>
            <TableCell align="center" sx={{
                backgroundColor: checkPresentCommonMod(module.code),
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
              <TableRow key = {2}>
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
                <Typography>Common Requirements</Typography>{" "}
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