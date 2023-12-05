from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.5) for (i, j) in edges]


class Election(Scene):

    def construct(self):
        self.camera.background_color = "#F9F2E5"
        
       
        intro = Text("II. LEADER ELECTION IN RINGS", color=BLACK, font="DejaVu Sans Mono").scale(0.7)

        self.play(Create(intro))
        self.wait(1)
        self.play(FadeOut(intro))
        self.wait(1)

        caption = Text("POINT DOMINANCE", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(3.5*UP)

        nodes = [Dot(color=RED_E, radius=0.2, point=1.5*LEFT + DOWN), Dot(color=BLUE_E, radius=0.2, point=1.5*RIGHT + UP)]
        tex = [Tex(r"$p$", font_size=120, color=RED_E).scale(0.3).move_to(1.5*LEFT + 1.5*DOWN),
               Tex(r"$q$", font_size=120, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 0.5*UP),
               Tex(r"$(x_p, y_p)$", font_size=100, color=RED_E).scale(0.3).move_to(1.5*LEFT + 0.5*DOWN),
               Tex(r"$(x_q, y_q)$", font_size=100, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 1.5*UP)]

        plane = NumberPlane(x_range=[-10,10,0.3], y_range=[-10, 10, 0.3], x_length=50, y_length=50, faded_line_style={'stroke_width': 0})

        self.play(Create(caption))
        self.add(plane)
        self.play(*[FadeIn(x) for x in nodes]) 
        self.play(*[Create(x) for x in tex])
        self.wait(4)