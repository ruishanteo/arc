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
            {mods.map((module) => {
                return (
                <TableRow key={module.id}>
                <TableCell align="center" sx={{
                    backgroundColor: "#FFFFFF",
                    color: "black",
                    fontSize: "1.0rem",
                }}>
                    {module.title}
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