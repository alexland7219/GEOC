from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.2) for (i, j) in edges]

def compNodes(nodes, color):
    return [Dot(color=color, radius=0.1, point=x[0]*RIGHT + x[1]*UP) for x in nodes]

def compArrows(nodes, edges, color, buf):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=color, max_tip_length_to_length_ratio=0.3, buff=buf) for (i, j) in edges]


class GenericElection(Scene):
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
        
        nodes = [(2.46, 2.73), (3.55, 1.69), (3, -0.5), (0.81, 1.38), (0.8, -0.13), (1.5,2),
                 (2.42, 1.56), (1.71, 0.80), (3,0.5), (0.6, 2.3)]
        nodes = [(n[0]-1.5, n[1]-1) for n in nodes]
        nodes = [(2*x, 2*y) for x, y in nodes]
        nodes = [(n[0]+2, n[1]-0.4) for n in nodes]

        nodes = compNodes(nodes, BLACK)

        #edges = [(x, (x+1) % len(nodes)) for x in range(len(nodes))]
        edges = [(0,5), (0,6), (0,1), (6,5), (1,6),(4,3), (3,7), (7,8),(4,8), (8,1),(8,2), (5,3),(6,7),(5,9)]
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

        arrows = [(8,7), (3,7), (4,7), (6,7)]
        arrows = compArrows(nodes, arrows, BLUE_C, 0.11)

        self.play(*[Create(x) for x in setupAlg])
        self.play(*[Create(x) for x in arrows])
        self.wait(5)

        ## Orient arrows

        setupAlg2 = [Tex(r"Links are to be directed \textbf{low-high}.", font_size=120, color=BLACK).scale(0.3).move_to(3*LEFT+0.5*DOWN),
            Tex(r"Every node will know their edges.", font_size=120, color=BLACK).scale(0.3).move_to(3.1*LEFT+1*DOWN)]


        arrows2 = [(8,7), (8,1), (1,0), (2,8), (7,3), (4,8), (4,3), (7,6), (3,5), (6,5), (6,1), (5,0), (6,0),(5,9)]
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

        square = Rectangle(color=GREEN_C, width=15, height=5)
        square.set_fill(GREEN_C, opacity=1)

        square.surround(stepName, buff=0.5)
        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        setupAlg = [Tex(r"Sources $\alpha$ and $\beta$ send their \textbf{id}.", font_size=120, color=BLACK).scale(0.3).move_to(3.5*LEFT+1*UP),
                    Tex(r"Worst \textbf{id} is propagated downstream.", font_size=120, color=BLACK).scale(0.3).move_to(3.1*LEFT+0.5*UP)]
        self.play(*[Create(x) for x in setupAlg])
        
        sources = [(3, -0.5),  (0.8, -0.13)]
        sources = [(n[0]-1.5, n[1]-1) for n in sources]
        sources = [(2*x, 2*y) for x, y in sources]
        sources = [(n[0]+2, n[1]-0.4) for n in sources]

        sources = compNodes(sources, RED_C)
        sources[1].set_color(BLUE_C)

        alpha = Tex(r"$\alpha$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[2].get_center() + 0.5*RIGHT)
        beta = Tex(r"$\beta$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[4].get_center() + 0.5*DOWN)

        self.play(*[Create(n) for n in sources])
        self.play(Create(alpha))
        self.play(Create(beta))

        self.wait(3)

        arrows = [(2,8), (4,8), (4,3)]
        arrows = compArrows(nodes, arrows, RED_C, 0.25)

        arrows[1].set_color(BLUE_C)
        arrows[2].set_color(BLUE_C)

        self.play(*[Create(a) for a in arrows])
        self.wait(3)

        arrows2 = [(8,7),(8,1)]
        arrows2 = compArrows(nodes, arrows2, RED_C, 0.25)
        self.play(*[Create(a) for a in arrows2])
        self.wait(1)

        arrows3 = [(7,3),(7,6)]
        arrows3 = compArrows(nodes, arrows3, RED_C, 0.25)
        self.play(*[Create(a) for a in arrows3])
        self.wait(1)

        arrows4 = [(3,5), (6,5), (6,0), (6,1)]
        arrows4 = compArrows(nodes, arrows4, RED_C, 0.25)
        self.play(*[Create(a) for a in arrows4])
        self.wait(1)

        arrows5 = [(5,9), (5,0), (1,0)]
        arrows5 = compArrows(nodes, arrows5, RED_C, 0.25)
        self.play(*[Create(a) for a in arrows5])
        self.wait(1)

        gamma = Tex(r"$\gamma$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[3].get_center() + 0.3*LEFT + 0.3*UP)
        delta = Tex(r"$\delta$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[8].get_center() + 0.5*RIGHT)
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

        stepName = Text("yo-YO", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(5*LEFT+2*UP)

        square = Rectangle(color=PURPLE, width=15, height=5)
        square.set_fill(PURPLE, opacity=1)

        square.surround(stepName, buff=0.5)
        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(5)

        