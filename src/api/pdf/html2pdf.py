# -*- coding: utf-8 -*-

from xhtml2pdf import pisa
from io import BytesIO

def generate_watermak(text):
	watermak = f"<center><pdf:barcode value='{text}' type='code128'/></center>"
	return watermak

def generate_pdf(content, watermark_text):

    result = BytesIO()

    content = generate_watermak(watermark_text) + content.text
    pisa.CreatePDF(src=content, dest=result)

    result.seek(0)
    return result