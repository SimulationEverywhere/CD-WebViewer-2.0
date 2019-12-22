[top]
components : webapp
components : university

out : standardsNotMet
out : facultyRejected
in : studentsRegistering

Link : studentsRegistering webAppIN@webapp
Link : webAppOUT@webapp studentApplicationIN@university
Link : rejectedApplicationID@university standardsNotMet
Link : advisorRejectedApplicationID@university facultyRejected

[webapp]

components : application@Application
components : applicationProcess@ApplicationProcess

out : webAppOUT
in : webAppIN

Link : webAppIN applicationIN@application
Link : applicationOUT@application applicationProcessIN@applicationProcess
Link : applicationProcessStatus@applicationProcess applicationFillingComplete@application
Link : applicationProcessOUT@applicationProcess webAppOUT

[application]
[applicationProcess]

[university]
components : registrar@Registrar
components : faculty@Faculty

out : rejectedApplicationID
out : advisorRejectedApplicationID
in : studentApplicationIN

Link : studentApplicationIN applicationVerificationIN@registrar
Link : applicationVerificationOUT@registrar applicationCourseCheck@faculty
Link : minStandardsNotMet@registrar rejectedApplicationID
Link : advisorOpinionOUT@faculty advisorRejectedApplicationID

[registrar]
[faculty]
