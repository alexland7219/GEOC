from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.2) for (i, j) in edges]

def compNodes(nodes, color):
    return [Dot(color=color, radius=0.1, point=x[0]*RIGHT + x[1]*UP) for x in nodes]

def compArrows(nodes, edges, color, buf):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=color, max_tip_length_to_length_ratio=0.3, buff=buf) for (i, j) in edges]


class GenericElection(Scene):
    def getSquare(self, text, color, pos, height=15, textcolor=WHITE):
        content = Text(text, color=textcolor, font="DejaVu Sans Mono").scale(0.4).move_to(pos)

        square = Rectangle(color=color, width=15, height=height)
        square.set_fill(color, opacity=1)

        square.surround(content, buff=0.2)
        self.play(*[Create(square), Create(content)])

        return square, content


    def construct(self):
        self.camera.background_color = "#F9F2E5"

        intro = Text("III. YO-YO PROTOCOL", color=BLACK, font="DejaVu Sans Mono").scale(0.7).move_to(0.5*UP)
        intro2 = Text("Universal Leader Election", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(0.5*DOWN)

        self.play(Create(intro))
        self.play(Create(intro2))
        self.wait(1)
        self.play(FadeOut(intro2))

        self.play(FadeOut(intro))

        self.wait(1)

        plane = NumberPlane(x_range=[-10,10,0.3], y_range=[-10, 10, 0.3], x_length=50, y_length=50, faded_line_style={'stroke_width': 0},
                        x_axis_config=dict(stroke_width=0), y_axis_config=dict(stroke_width=0), background_line_style=dict(stroke_opacity=0.35))

        self.add(plane)

        self.wait(2)

        #nodes = [(3, 3), (3.7, 1.5), (3.1, -0.5), (0.7, -0.8), (0, 1), (0.65, 2.2)]
        
        nodes = [(2.46, 2.73), (3.55, 1.69), (2.6, -0.5), (0.81, 1.38), (0.8, -0.13), (1.5,2),
                 (2.42, 1.56), (1.71, 0.80), (3,0.5), (0.6, 2.3)]
        nodes = [(n[0]-1.5, n[1]-1) for n in nodes]
        nodes = [(2*x, 2*y) for x, y in nodes]
        nodes = [(n[0]+2, n[1]-0.4) for n in nodes]

        nodes = compNodes(nodes, BLACK)

        #edges = [(x, (x+1) % len(nodes)) for x in range(len(nodes))]
        #edges = [(0,5), (0,6), (0,1), (6,5), (1,6),(4,3), (3,7), (7,8),(4,8), (8,1),(8,2), (5,3),(6,7),(5,9)]
        edges = [(0,1), (5,0), (9,3), (3,5), (6,5), (7,6), (1,8), (3,4), (4,7), (8,7), (2,7), (2,8), (7,5)]
        edges = compEdges(nodes, edges)

        self.play(*[Create(x) for x in nodes])
        self.play(*[Create(e) for e in edges])
        self.wait(5)

        text0 = Tex(r"\textbf{YO-YO Protocol} steps", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT+3*UP)

        self.play(Create(text0))
        self.wait(1)

        ### STEP ONE #####
        stepName = Text("SETUP", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(5*LEFT+2*UP)

        square = Rectangle(color=RED_C, width=15, height=5)
        square.set_fill(RED_C, opacity=1)

        square.surround(stepName, buff=0.5)

        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        setupAlg = [Tex(r"Nodes will ask \textbf{id} of every neighbor.", font_size=120, color=BLACK).scale(0.3).move_to(3*LEFT+1*UP),
                    Tex(r"Every link will interchange two \textbf{id}.", font_size=120, color=BLACK).scale(0.3).move_to(3.1*LEFT+0.5*UP)]

        arrows = [(5,7), (6,7), (8,7), (2,7), (4,7)]
        arrows = compArrows(nodes, arrows, BLUE_C, 0.11)

        self.play(*[Create(x) for x in setupAlg])
        self.play(*[Create(x) for x in arrows])
        self.wait(5)

        ## Orient arrows

        setupAlg2 = [Tex(r"Links are to be directed \textbf{low-high}.", font_size=120, color=BLACK).scale(0.3).move_to(3*LEFT+0.5*DOWN),
            Tex(r"Every node will know their edges.", font_size=120, color=BLACK).scale(0.3).move_to(3.1*LEFT+1*DOWN)]


        arrows2 = [(1,0), (5,0), (3,9), (3,5), (6,5), (7,6), (8,1), (4,3), (4,7), (8,7), (2,7), (2,8), (7,5)]
        arrows2 = compArrows(nodes, arrows2, BLACK, 0.25)
        self.play(*[Create(c) for c in setupAlg2])
        self.play(*[Uncreate(x) for x in arrows])

        self.play(*[Create(a) for a in arrows2])
        self.play(*[Uncreate(e) for e in edges])

        self.wait(5)

        setupAlg3 = [Tex(r"We have created a \textbf{DAG} $\overrightarrow{G}$.", font_size=120, color=BLACK).scale(0.3).move_to(3.2*LEFT+2*DOWN)]
        self.play(*[Create(c) for c in setupAlg3])
        self.wait(5)

        ### STEP ONE: YO-###

        self.play(*[Uncreate(c) for c in setupAlg3])
        self.play(*[Uncreate(c) for c in setupAlg2])
        self.play(*[Uncreate(x) for x in setupAlg])
        self.play(Uncreate(square))
        self.play(Uncreate(stepName))

        stepName = Text("YO-yo", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(5*LEFT+2*UP)

        square = Rectangle(color=0x009900, width=15, height=5)
        square.set_fill(0x009900, opacity=1)

        square.surround(stepName, buff=0.5)
        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        setupAlg = [Tex(r"Sources $\alpha$ and $\beta$ send their \textbf{id}.", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT+1*UP),
                    Tex(r"Lowest \textbf{id} is propagated \textit{downstream}.", font_size=120, color=BLACK).scale(0.3).move_to(3.1*LEFT+0.5*UP)]
        self.play(*[Create(x) for x in setupAlg])
        
        sources = [(2.6, -0.5),  (0.8, -0.13)]
        sources = [(n[0]-1.5, n[1]-1) for n in sources]
        sources = [(2*x, 2*y) for x, y in sources]
        sources = [(n[0]+2, n[1]-0.4) for n in sources]

        sources = compNodes(sources, 0x9900ff)
        sources[1].set_color(0x009900)

        alpha = Tex(r"$\alpha$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[2].get_center() + 0.5*RIGHT)
        beta = Tex(r"$\beta$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[4].get_center() + 0.5*DOWN)

        self.play(*[Create(n) for n in sources])
        self.play(Create(alpha))
        self.play(Create(beta))

        self.wait(3)

        arrows = [(2,8), (2,7), (4,7), (4,3)]
        arrows = compArrows(nodes, arrows, 0x9900ff, 0.25)

        arrows[2].set_color(0x009900)
        arrows[3].set_color(0x009900)

        self.play(*[Create(a) for a in arrows])
        self.wait(3)

        arrows2 = [(8,7), (8,1),(3,5), (3,9)]
        arrows2 = compArrows(nodes, arrows2, 0x9900ff, 0.25)
        arrows2[-2].set_color(0x009900)
        arrows2[-1].set_color(0x009900)
        self.play(*[Create(a) for a in arrows2])
        self.wait(1)

        arrows3 = [(7,5),(7,6), (1,0)]
        arrows3 = compArrows(nodes, arrows3, 0x9900ff, 0.25)
        self.play(*[Create(a) for a in arrows3])
        self.wait(1)

        arrows4 = [(6,5)]
        arrows4 = compArrows(nodes, arrows4, 0x9900ff, 0.25)
        self.play(*[Create(a) for a in arrows4])
        self.wait(1)

        arrows5 = [(5,0)]
        arrows5 = compArrows(nodes, arrows5, 0x9900ff, 0.25)
        self.play(*[Create(a) for a in arrows5])
        self.wait(1)

        gamma = Tex(r"$\gamma$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[7].get_center() + 0.4*LEFT+0.2*UP)
        delta = Tex(r"$\delta$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[5].get_center() + 0.4*UP)
        self.play(Create(gamma))
        self.play(Create(delta))

        setupAlg2 = [Tex(r"Nodes $\gamma$ and $\delta$ decide to propagate $\alpha$.", font_size=120, color=BLACK).scale(0.3).move_to(3.2*LEFT + DOWN),
        Tex(r"\textbf{Sinks} start execution of next step.", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT + 1.5*DOWN)]
        self.play(*[Create(x) for x in setupAlg2])

        self.wait(5)

        self.play(*[Uncreate(x) for x in setupAlg2])
        self.play(*[Uncreate(x) for x in setupAlg])
        self.play(Uncreate(square))
        self.play(Uncreate(stepName))
        self.play(Uncreate(gamma))
        self.play(Uncreate(delta))

        stepName = Text("yo-YO", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(5*LEFT+2*UP)

        square = Rectangle(color=0x9900ff, width=15, height=5)
        square.set_fill(0x9900ff, opacity=1)

        square.surround(stepName, buff=0.5)
        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        ### yo-YO steop ####

        setupAlg = [Tex(r"Nodes propagate \textit{upstream} signals \textbf{Y}/\textbf{N}.", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT+1*UP),
            Tex(r"\textbf{Y} sent to edges with local smallest \textbf{id}.", font_size=120, color=BLACK).scale(0.3).move_to(3.45*LEFT),
            Tex(r"\textbf{N} sent otherwise, or if a \textbf{N} is recieved.", font_size=120, color=BLACK).scale(0.3).move_to(3.45*LEFT + 0.5*DOWN)]
        self.play(*[Create(x) for x in setupAlg])

        self.wait(4)

        self.getSquare("Y", 0x0033cc, arrows2[-1].get_center())
        self.getSquare("Y", 0x0033cc, arrows3[-1].get_center())
        self.getSquare("Y", 0x0033cc, arrows5[0].get_center())

        self.wait(2)

        self.getSquare("Y", 0x0033cc, arrows2[1].get_center())
        self.getSquare("Y", 0x0033cc, arrows3[0].get_center())
        self.getSquare("Y", 0x0033cc, arrows4[0].get_center())
        self.getSquare("N", 0xe60000, arrows2[-2].get_center())

        self.wait(2)

        self.getSquare("N", 0xe60000, arrows[-1].get_center())
        self.getSquare("Y", 0x0033cc, arrows3[1].get_center())

        self.wait(2)

        self.getSquare("N", 0xe60000, arrows[-2].get_center())
        self.getSquare("Y", 0x0033cc, arrows2[0].get_center())
        self.getSquare("Y", 0x0033cc, arrows[1].get_center())

        self.wait(2)

        self.getSquare("Y", 0x0033cc, arrows[0].get_center())

        self.wait(5)

        setupAlg2 = [Tex(r"Reverse the \textbf{N} edges.", font_size=120, color=BLACK).scale(0.3).move_to(4.7*LEFT + 2.5*DOWN),
        Tex(r"Sources with at least one \textbf{N} die ($\beta$).", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT + 2*DOWN)]
        self.play(*[Create(x) for x in setupAlg2[::-1]])

        self.wait(5)

        ## PRUNING ##

        self.play(*[Uncreate(x) for x in setupAlg2[::-1]])
        self.play(*[Uncreate(x) for x in setupAlg])
        self.play(Uncreate(stepName))
        self.play(Uncreate(square))

        stepName = Text("PRUNING", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(5*LEFT+2*UP)

        square = Rectangle(color=0xa67b5b, width=15, height=5)
        square.set_fill(0xa67b5b, opacity=1)

        square.surround(stepName, buff=0.5)
        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        setupAlg = [Tex(r"\textit{Unary sinks} are useless.", font_size=120, color=BLACK).scale(0.3).move_to(4.4*LEFT+1*UP),
            Tex(r"\textit{In edges} with same value are useless.", font_size=120, color=BLACK).scale(0.3).move_to(3.45*LEFT + 0.5*UP)]
        self.play(*[Create(x) for x in setupAlg])

        self.wait(2)

        self.getSquare("PRUNE", 0xa67b5b, nodes[9].get_center(), height=5)
        self.getSquare("PRUNE", 0xa67b5b, arrows3[-1].get_center(), height=5)
        self.getSquare("PRUNE", 0xa67b5b, arrows4[-1].get_center(), height=5)
        self.getSquare("PRUNE", 0xa67b5b, arrows[1].get_center(), height=5)

        self.wait(2)

        setupAlg = [Tex(r"Every iteration of YO-YO kills a source.", font_size=120, color=BLACK).scale(0.3).move_to(3.3*LEFT+1*DOWN),
            Tex(r"Only the smallest \textbf{id}, $\alpha$, survives.", font_size=120, color=BLACK).scale(0.3).move_to(3.8*LEFT + 1.5*DOWN),
            Tex(r"Termination when only $\alpha$ isn't pruned.", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT+2*DOWN)]
        self.play(*[Create(x) for x in setupAlg])

        self.getSquare("LEADER", 0xffef00, nodes[2].get_center()+LEFT, height=5, textcolor=BLACK)

        self.wait(2)
