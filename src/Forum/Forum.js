import { useEffect, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { getAuth } from "@firebase/auth";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../UserAuth/Firebase";
import { LoadingSpinner } from "../Components/LoadingSpinner.js";

import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material/";

import { Add } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function TableRows({ postList, page, rowsPerPage }) {
  const rowList =
    rowsPerPage > 0
      ? postList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : postList;

  return rowList.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6}>
        <Typography align="center">No posts found.</Typography>
      </TableCell>
    </TableRow>
  ) : (
    rowList.map((row) => {
      return (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" align="center">
            <Link
              to={`/forum/${row.id}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              {row.title}
            </Link>
          </TableCell>
          <TableCell style={{ width: "40vw" }} align="center">
            <Link
              to={`/forum/${row.id}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              {row.post}
            </Link>
          </TableCell>
          <TableCell style={{ width: 160 }} align="center">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              sx={{ justifyContent: "center" }}
            >
              <Avatar
                sx={{ mr: 1 }}
                src={row.author.profilePic}
                alt="profilepic"
              />
              <Link
                to={`/forum/${row.id}`}
                style={{ color: "black", textDecoration: "none" }}
              >
                {row.author.username}
              </Link>
            </Box>
          </TableCell>
          <TableCell style={{ width: 160 }} align="center">
            <Link
              to={`/forum/${row.id}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              {row.datetime}
            </Link>
          </TableCell>
        </TableRow>
      );
    })
  );
}

export function Forum() {
  const auth = getAuth();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - postList.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPosts = useCallback(async () => {
    setLoading(true);

    const data = await getDocs(collection(db, "posts"));

    setLoading(false);
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, []);

  useEffect(() => {
    getPosts();
  }, [user, getPosts]);

  return (
    <Container maxWidth="lg">
      <Box align="center" sx={{ maxWidth: "90vw" }}>
        <Box align="left" sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 450, minWidth: 250 }}>
            Forum
          </Typography>
          <Button
            sx={{ mt: 2, backgroundColor: "#b7b0f5", color: "white" }}
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/forum/new")}
          >
            Post
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 2, maxWidth: "90vw" }}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead
              sx={{
                "& th": {
                  backgroundColor: "#cff8df",
                  color: "black",
                  fontSize: "1.2rem",
                },
              }}
            >
              <TableRow>
                <TableCell align="center">TITLE</TableCell>
                <TableCell align="center">PREVIEW</TableCell>
                <TableCell align="center">AUTHOR</TableCell>
                <TableCell align="center">DATE</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRows
                    postList={postList}
                    page={page}
                    rowsPerPage={rowsPerPage}
                  />

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
            <TableFooter
              sx={{
                backgroundColor: "#fcf4d4",
                color: "black",
                fontSize: "1.2rem",
              }}
            >
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  count={postList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
