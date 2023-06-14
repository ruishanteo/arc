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

export function ProgRequirements({
}) {
    let progMods = require('../module_data/progMods.json');

    const degrees = useSelector((state) => state.plannerDeg.degrees);
    const semesters = useSelector((state) => state.plannerSem.semesters);

    function getDegreeTitle() {
      if (typeof degrees[0]?.title != 'undefined') {
        return degrees[0]?.title;
      }
      return "";
    }
    
    const deg = getDegreeTitle();

    function checkValues(arr, list) {
      if (Array.isArray(arr)) {
        return arr.some(value => {
          return checkValues(value, list)});
      } else {
        // Check if the single value is present
        return list.includes(arr);
      }
    }
  
    function checkPresent(titleArr) {
      const arr = semesters.flatMap((semester) =>
      semester.modules.map((module) => module.modInfo.moduleCode));
      const present = titleArr.find(title => checkValues(title, arr));
      if (present) {
        return "#cff8df";
      } else {
        return "#FFFFFF";
      }
    }

    const tab = () => {
      if (deg in progMods) {
        return (
          progMods[deg].map((module, index) => {
            return (
              <TableRow key={index}>
              <TableCell align="center" sx={{
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
          </TableBody>
        </Table>
      </form>
    </TableContainer>
    </>
    );
}