import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";
import { tab } from "@testing-library/user-event/dist/tab";

export function ProgRequirements({
    checkPresent,
    getDegreeTitle
}) {
    const progMods = {'Computer Science': [
        { title: 'CS1101S', code: 'CS', id: 1 },
        { title: 'CS1231S', code: 'CS', id: 2 },
        { title: 'CS2030S', code: 'CS', id: 3},
        { title: 'CS2040S', code: 'CS', id: 4}
    ], 
    'Business Analytics': [
      { title: 'BT1101', code: 'BT', id: 1 },
      { title: 'CS1010S', code: 'CS', id: 4 },
      { title: 'BT2101', code: 'BT', id: 3},
      { title: 'BT2102', code: 'BT', id: 2}
    ], 
    'Information Systems': [
      { title: 'BT1101', code: 'BT', id: 1 },
      { title: 'CS1010J', code: 'CS', id: 2 },
      { title: 'IS2101', code: 'IS', id: 3},
      { title: 'IS2102', code: 'IS', id: 4}
    ], 
    'Computer Engineering': [
      { title: 'CS1010', code: 'CS', id: 1 },
      { title: 'CS1231', code: 'CS', id: 2 },
      { title: 'CS2040C', code: 'CS', id: 3},
      { title: 'MA1511', code: 'MA', id: 4}
    ], 
    'Information Security': [
      { title: 'CS1231S', code: 'CS', id: 1 },
      { title: 'CS2040C', code: 'CS', id: 3 },
      { title: 'CS2100', code: 'CS', id: 2},
    ], 
    'Others': [
      { title: '', code: '', id: 1 },
    ]};

    const deg = getDegreeTitle();

    const tab = () => {
      if (deg in progMods) {
        return (
          progMods[deg].map((module) => {
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