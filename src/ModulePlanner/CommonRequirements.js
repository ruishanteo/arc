import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function CommonRequirements({
    checkPresentCommonMod,
    getDegreeFaculty
}) {
    const commonMods = [
        { title: 'GEC'},
        { title: 'GEX'},
        { title: 'GEA'},
        { title: 'GESS'},
        { title: 'GEN'},
        { title: 'Computer Ethics'},
        
    ]

    const deg = getDegreeFaculty();

    const tab = () => {
      if (deg === "SOC") {
        return (
        commonMods.map((module, index) => {
            return (
            <TableRow key={index}>
            <TableCell align="center" sx={{
                backgroundColor: checkPresentCommonMod(module.title),
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
          </TableBody>
        </Table>
        </form>
    </TableContainer>
    </>
    );
}