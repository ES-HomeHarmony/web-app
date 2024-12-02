import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Invoice({ date, expenseType, price, noGutter, pdfUrl }) {
  const openPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
    }
  };

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {expenseType}
        </MDTypography>
        <MDTypography variant="caption" fontWeight="regular" color="error">
          {date}
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography variant="button" fontWeight="regular" color="text">
          {price}
        </MDTypography>
        <MDBox
          display="flex"
          alignItems="center"
          lineHeight={1}
          ml={3}
          sx={{ cursor: "pointer" }}
          onClick={openPdf}
        >
          <Icon fontSize="small">picture_as_pdf</Icon>
          <MDTypography variant="button" fontWeight="bold">
            &nbsp;PDF
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Invoice
Invoice.defaultProps = {
  noGutter: false,
  pdfUrl: "",
};

// Typechecking props for the Invoice
Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  expenseType: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  pdfUrl: PropTypes.string,
};

export default Invoice;
