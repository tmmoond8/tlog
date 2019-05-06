import CMS from 'netlify-cms'

import "./post-styles.css";

import BlogPostPreview from './preview-templates/BlogPostPreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
