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

export function UnrestrictedRequirements() {
    const semesters = useSelector((state) => state.plannerSem.semesters);

    const mods = semesters.flatMap((semester) => {
        return semester.modules.filter((module) => module.category.title === "UE" && module.modInfo.moduleCode);
      });

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
                <Typography>Unrestricted Elective</Typography>{" "}
                </TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
            {mods.map((module, index) => {
                return (
                <TableRow key={index} className="UeTableRows">
                <TableCell 
                  id={`unrestricted-mod-${index}`}
                  className="UeTableCell"
                  align="center" 
                  sx={{
                    backgroundColor: "#cff8df",
                    color: "black",
                    fontSize: "1.0rem",
                }}>
                    {module.modInfo.moduleCode}
                </TableCell>
                </TableRow>
                )
            })}
            </TableBody>
        </Table>
        </form>
    </TableContainer>
    </>
    );
}