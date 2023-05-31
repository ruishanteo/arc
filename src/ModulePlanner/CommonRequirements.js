import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function CommonRequirements({
    checkPresentCommonMod,
    checkPresentCommonModRC,
    getDegreeFaculty,
    getProg
}) {
    let commonMods = require('../module_data/commonMods.json');

    const deg = getDegreeFaculty();
    //cd Any course from Chemistry, Physics, or Biological Sciences departments starting with codes PC, CM, LSM respectively.
    //separeate one to get the programme
    //rc4 - 1 junior, 1 senior uts, 1 senior utc, 1 iec, 1 Digital Literacy or Data Literacy
    //capt - 1 junior, 2 senior, 1 iec, 1 Digital Literacy or Data Literacy

    const prog = getProg();
    console.log(prog);

    const tab = () => {
        if (prog === "RC4" || prog === "Tembusu" || prog === "CAPT") {
            let specProg = require('../module_data/utcp.json');
          return (
          specProg.map((module, index) => {
              return (
              <TableRow key={index}>
              <TableCell align="center" sx={{
                  backgroundColor: checkPresentCommonModRC(module.code),
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
      }

    const tab2 = () => {
        if (prog === "NUSC") {
            return (
                <TableRow key = {1}>
    
                </TableRow>
            );
        } else if (deg === "SOC") {
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