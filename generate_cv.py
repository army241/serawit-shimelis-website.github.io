import sys
import os

def create_cv_pdf(filename="Serawit_Shimelis_CV.pdf"):
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        doc = SimpleDocTemplate(
            filename,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Monochrome & Charcoal Palette - NO BLUE
        PRIMARY = colors.HexColor('#0F172A')    # Slate 900 / Dark Charcoal
        SECONDARY = colors.HexColor('#334155')  # Slate 700
        TEXT_MUTED = colors.HexColor('#475569') # Slate 600
        LINE_CLR = colors.HexColor('#64748B')   # Slate 500

        title_style = ParagraphStyle(
            'CVTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=PRIMARY
        )

        contact_style = ParagraphStyle(
            'CVContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=SECONDARY
        )

        sec_heading_style = ParagraphStyle(
            'CVSecHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11.5,
            leading=15,
            textColor=PRIMARY,
            spaceAfter=3
        )

        body_style = ParagraphStyle(
            'CVBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=SECONDARY
        )

        bullet_style = ParagraphStyle(
            'CVBullet',
            parent=body_style,
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=3
        )

        story = []

        # Header Block
        header_text = """
        <b>SERAWIT SHIMELIS NIGATU</b><br/>
        <font color="#334155">Second Year Computer Science Student | Addis Ababa University</font>
        """
        contact_info = """
        <b>Email:</b> serawitshimelis1998@gmail.com<br/>
        <b>Phone:</b> +251 943 357 763<br/>
        <b>Location:</b> Addis Ababa, Ethiopia
        """

        header_table_data = [
            [Paragraph(header_text, title_style), Paragraph(contact_info, contact_style)]
        ]
        
        header_table = Table(header_table_data, colWidths=[310, 230])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]))

        story.append(header_table)
        story.append(Spacer(1, 4))
        story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=2, spaceAfter=8))

        # Section 1: Professional Profile
        story.append(Paragraph("PROFESSIONAL PROFILE", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        profile_text = """
        Motivated second-year Computer Science student at Addis Ababa University with a <b>CGPA of 3.97</b>. 
        Passionate about software development, web engineering, C++ system fundamentals, and algorithm optimization. 
        A continuous learner focused on mastering modern front-end and back-end frameworks while exploring AI & ML technologies.
        """
        story.append(Paragraph(profile_text, body_style))
        story.append(Spacer(1, 8))

        # Section 2: Education
        story.append(Paragraph("EDUCATION", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        edu_text = """
        <b>Bachelor of Science in Computer Science</b> — Addis Ababa University<br/>
        <i>Second Year Student &nbsp;|&nbsp; <b>CGPA: 3.97 / 4.00</b></i>
        """
        story.append(Paragraph(edu_text, body_style))
        story.append(Spacer(1, 8))

        # Section 3: Technical Skills
        story.append(Paragraph("TECHNICAL SKILLS", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        
        skills = [
            "<b>Web Development:</b> HTML5, CSS3, Responsive Design, JavaScript (ES6+), RESTful APIs",
            "<b>Programming Languages:</b> C++ (OOP & Data Structures), Python, JavaScript",
            "<b>Tools & Platforms:</b> Git, GitHub, VS Code, Linux Shell, PostgreSQL / JSON Data Storage"
        ]
        for sk in skills:
            story.append(Paragraph(f"• {sk}", bullet_style))
        story.append(Spacer(1, 8))

        # Section 4: Projects & Coursework
        story.append(Paragraph("PROJECTS & COURSEWORK", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        
        projects = [
            ("Responsive Web Design & JS Applications", "Built multiple dynamic web projects using HTML, CSS, and vanilla JS with state management and local storage syncing."),
            ("C++ Object-Oriented Projects", "Developed console-based software modules implementing C++ classes, pointers, and memory control."),
            ("Algorithmic Problem Solving", "Solved coding puzzles on LeetCode using Python to sharpen data structures and algorithmic thinking.")
        ]
        for title, desc in projects:
            story.append(Paragraph(f"<b>{title}</b>", body_style))
            story.append(Paragraph(f"<i>{desc}</i>", ParagraphStyle('SubBody', parent=body_style, leftIndent=8, textColor=TEXT_MUTED)))
            story.append(Spacer(1, 4))

        story.append(Spacer(1, 4))

        # Section 5: Learning Goals
        story.append(Paragraph("LEARNING GOALS", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        
        goals = [
            "Advance front-end mastery (React, modern CSS architectures, view transitions).",
            "Expand backend development capabilities (Node.js, Express, SQL/NoSQL databases).",
            "Deepen understanding of AI/ML foundations and computer science theory."
        ]
        for g in goals:
            story.append(Paragraph(f"• {g}", bullet_style))

        story.append(Spacer(1, 8))

        # Section 6: Languages
        story.append(Paragraph("LANGUAGES", sec_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_CLR, spaceBefore=1, spaceAfter=5))
        story.append(Paragraph("<b>Amharic:</b> Native &nbsp;|&nbsp; <b>English:</b> Professional Working Proficiency", body_style))

        doc.build(story)
        print(f"CV PDF successfully generated at: {os.path.abspath(filename)}")

    except Exception as e:
        print(f"Error generating PDF with reportlab: {e}")

if __name__ == '__main__':
    create_cv_pdf()
