import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function ProgRequirements({
    checkPresent,
    getDegreeTitle
}) {
    let progMods = require('../module_data/progMods.json');

    const deg = getDegreeTitle();

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