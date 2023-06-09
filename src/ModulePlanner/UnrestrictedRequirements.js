import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function UnrestrictedRequirements({
    getUe
}) {
    const mods = getUe();

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
                <TableRow key={index}>
                <TableCell align="center" sx={{
                    backgroundColor: "#cff8df",
                    color: "black",
                    fontSize: "1.0rem",
                }}>
                    {module.moduleCode}
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