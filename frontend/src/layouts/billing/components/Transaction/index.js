import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function Transaction({ color, icon, name, description, value, pdfUrl }) {
  const openPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
    }
  };

  return (
    <MDBox key={name} component="li" py={1} pr={2} mb={1}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        {/* Transaction Details */}
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2}>
            <MDButton variant="outlined" color={color} iconOnly circular>
              <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
            </MDButton>
          </MDBox>
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {name}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Transaction Value and PDF Download */}
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="button" color={color} fontWeight="medium" textGradient>
            {value}
          </MDTypography>
          <MDBox
            display="flex"
            alignItems="center"
            lineHeight={1}
            ml={2}
            sx={{ cursor: pdfUrl ? "pointer" : "default" }}
            onClick={openPdf}
          >
            <Icon fontSize="small">picture_as_pdf</Icon>
            <MDTypography variant="button" fontWeight="bold">
              &nbsp;PDF
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Default values for the Transaction component props
Transaction.defaultProps = {
  pdfUrl: "",
};

// Typechecking props for Transaction
Transaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  pdfUrl: PropTypes.string, // URL for the PDF document
};

export default Transaction;
