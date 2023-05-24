import { TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Typography } from "@mui/material";

export function CommonRequirements({
    checkPresent
}) {
    const commonMods = [
        
        { title: 'CS1010', code: 'GES', id: 1 },
        { title: 'CS1010S', code: 'IS', id: 3 },
        { title: 'CS1010E', code: 'CS', id: 2},
        { title: 'CS1101S', code: 'CS', id: 4}
    ]

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
            {commonMods.map((module) => {
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
            })}
            </TableBody>
        </Table>
        </form>
    </TableContainer>
    </>
    );
}