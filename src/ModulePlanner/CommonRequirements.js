import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function CommonRequirements({
    checkPresent,
    getDegreeFaculty
}) {
    const commonMods = [
        { title: 'GEC', code: 'GEC', id: 1 },
        { title: 'GEX', code: 'GEX', id: 2 },
        { title: 'GEA', code: 'GEA', id: 3},
        { title: 'GESS', code: 'GESS', id: 4},
        { title: 'GEN', code: 'GEN', id: 5},
        { title: 'IS1108', code: 'IS', id: 6}

    ]

    const deg = getDegreeFaculty();

    const tab = () => {
      if (deg === "SOC") {
        return (
        commonMods.map((module) => {
            return (
            <TableRow key={module.id}>
            <TableCell align="center" sx={{
                backgroundColor: checkPresent(module.title),
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
            <TableRow key = {1}>
              <TableCell align="center" sx={{
                  backgroundColor: '#FFFFFF',
                  color: "black",
                  fontSize: "1.0rem",
              }}>
                  {"To Be Updated"}
              </TableCell>
              </TableRow>
          </TableBody>
        </Table>
        </form>
    </TableContainer>
    </>
    );
}