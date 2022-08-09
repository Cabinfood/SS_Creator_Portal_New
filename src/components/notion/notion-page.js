import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

export default function NotionPage({ pageData, fullPage = false }) {
  return (
	<div className="notion-page-wrapper">
		{pageData
		? <NotionRenderer fullPage={fullPage} recordMap={pageData || {}} />
		: null	  
		}
  	</div>  
  )
}
